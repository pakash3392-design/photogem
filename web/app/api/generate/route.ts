import { NextRequest, NextResponse } from 'next/server';
import { STYLE_PRESETS } from '@/lib/styles';

// This route receives the user's photo (as a data URL) + a style id, and
// returns a real AI-edited photo using Pollinations.ai's "kontext" model --
// free, no API key, no signup, no billing.
//
// This sends the photo directly to Pollinations' edit endpoint (multipart
// upload) rather than routing through a separate temporary file host --
// simpler and more reliable than a two-step relay.
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

    const editPrompt = `Expert professional photo edit. Apply this exact treatment with real skill -- proper re-lighting, color grading, atmosphere, and mood, like a professional retoucher, not a flat filter: ${style.prompt}. Keep the same subject and composition recognizable -- this is a professional edit of this photo, not a different photo.`;

    const form = new FormData();
    form.append('image', new Blob([imageBuffer], { type: mimeType }), `photo.${ext}`);
    form.append('prompt', editPrompt);
    form.append('model', 'kontext');

    if (!process.env.POLLINATIONS_API_KEY) {
      return NextResponse.json(
        { error: 'Server is missing POLLINATIONS_API_KEY. See README.md.' },
        { status: 500 }
      );
    }

    const editRes = await fetch('https://gen.pollinations.ai/v1/images/edits', {
      method: 'POST',
      body: form,
      headers: {
        'User-Agent': 'Darkroom-App/1.0',
        Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`,
      },
    });

    if (!editRes.ok) {
      const text = await editRes.text().catch(() => '');
      throw new Error(
        editRes.status === 429
          ? 'Too many requests right now -- wait about 15 seconds and try again.'
          : `The editor didn't return a result (${editRes.status}). ${text.slice(0, 200)}`
      );
    }

    const responseContentType = editRes.headers.get('content-type') || '';

    let resultUrl: string;
    if (responseContentType.includes('application/json')) {
      // Some Pollinations endpoints return JSON with a hosted image URL
      // rather than raw image bytes -- handle both shapes.
      const data = await editRes.json();
      const hostedUrl = data?.data?.[0]?.url || data?.url || data?.images?.[0];
      if (!hostedUrl) {
        throw new Error('The editor did not return an image. Try again.');
      }
      const imgRes = await fetch(hostedUrl);
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
      const imgContentType = imgRes.headers.get('content-type') || 'image/jpeg';
      resultUrl = `data:${imgContentType};base64,${imgBuffer.toString('base64')}`;
    } else if (responseContentType.startsWith('image/')) {
      const resultBuffer = Buffer.from(await editRes.arrayBuffer());
      resultUrl = `data:${responseContentType};base64,${resultBuffer.toString('base64')}`;
    } else {
      const text = await editRes.text().catch(() => '');
      throw new Error(`Unexpected response from the editor. ${text.slice(0, 200)}`);
    }

    return NextResponse.json({ resultUrl });
  } catch (err: any) {
    console.error('Style edit failed:', err);
    return NextResponse.json(
      { error: err?.message || 'Style edit failed' },
      { status: 500 }
    );
  }
}
