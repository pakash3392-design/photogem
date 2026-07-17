import { NextRequest, NextResponse } from 'next/server';
import { STYLE_PRESETS } from '@/lib/styles';

// This route receives the user's photo (as a data URL) + a style id, and
// returns a real AI-edited photo -- entirely free, no API key, no signup,
// no billing.
//
// How: Pollinations.ai's "kontext" model does true image-to-image editing,
// but its API needs a URL to the input photo rather than raw image data.
// So this route does two steps:
//   1. Briefly upload the photo to 0x0.st (a free, anonymous, no-account
//      file host) to get a temporary public URL.
//   2. Pass that URL + the style's prompt to Pollinations' kontext model,
//      which returns the edited image directly.
//
// Honest tradeoff: step 1 means the photo is briefly reachable at an
// unguessable but public URL on a third-party host, not private the way a
// signed-in service would be. Fine for personal use; worth reconsidering
// (e.g. switching to a paid, private AI provider) before handling real
// users' private photos at scale.
//
// Docs: https://github.com/pollinations/pollinations/blob/master/APIDOCS.md

export async function POST(req: NextRequest) {
  try {
    const { imageDataUrl, styleId } = await req.json();

    if (!imageDataUrl || !styleId) {
      return NextResponse.json(
        { error: 'Missing imageDataUrl or styleId' },
        { status: 400 }
      );
    }

    const style = STYLE_PRESETS.find((s) => s.id === styleId);
    if (!style) {
      return NextResponse.json({ error: 'Unknown style' }, { status: 400 });
    }

    const match = imageDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }
    const [, mimeType, base64Data] = match;
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const ext = mimeType.split('/')[1] || 'jpg';

    // Step 1: get a temporary public URL for the photo.
    const uploadForm = new FormData();
    uploadForm.append('file', new Blob([imageBuffer], { type: mimeType }), `photo.${ext}`);

    const uploadRes = await fetch('https://0x0.st', {
      method: 'POST',
      body: uploadForm,
      headers: { 'User-Agent': 'Darkroom-App/1.0' },
    });
    if (!uploadRes.ok) {
      throw new Error('Could not prepare your photo for editing. Try again in a moment.');
    }
    const tempImageUrl = (await uploadRes.text()).trim();
    if (!tempImageUrl.startsWith('http')) {
      throw new Error('Could not prepare your photo for editing. Try again in a moment.');
    }

    // Step 2: send it to Pollinations' kontext model for real AI editing.
    const editPrompt = `Expert professional photo edit. Apply this exact treatment with real skill -- proper re-lighting, color grading, atmosphere, and mood, like a professional retoucher, not a flat filter: ${style.prompt}. Keep the same subject and composition recognizable -- this is a professional edit of this photo, not a different photo.`;

    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(editPrompt)}?model=kontext&image=${encodeURIComponent(tempImageUrl)}&width=1024&height=1024&nologo=true&referrer=darkroom-app`;

    const editRes = await fetch(pollinationsUrl, {
      headers: { 'User-Agent': 'Darkroom-App/1.0' },
    });

    if (!editRes.ok) {
      const text = await editRes.text().catch(() => '');
      throw new Error(
        editRes.status === 429
          ? 'Too many requests right now -- wait about 15 seconds and try again.'
          : `The editor didn't return a result (${editRes.status}). ${text.slice(0, 150)}`
      );
    }

    const resultBuffer = Buffer.from(await editRes.arrayBuffer());
    const resultContentType = editRes.headers.get('content-type') || 'image/jpeg';
    if (!resultContentType.startsWith('image/')) {
      throw new Error('The editor did not return an image. Try again.');
    }
    const resultUrl = `data:${resultContentType};base64,${resultBuffer.toString('base64')}`;

    return NextResponse.json({ resultUrl });
  } catch (err: any) {
    console.error('Style edit failed:', err);
    return NextResponse.json(
      { error: err?.message || 'Style edit failed' },
      { status: 500 }
    );
  }
}
