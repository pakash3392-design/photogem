import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { STYLE_PRESETS } from '@/lib/styles';

// This route receives the user's photo (as a data URL) + a style id, sends
// both to Google's Gemini 2.5 Flash Image model ("Nano Banana"), and
// returns the edited photo as a data URL.
//
// Why Gemini instead of Replicate: Gemini 2.5 Flash Image has a genuine
// free tier (hundreds of edits/day, no credit card) as of mid-2026, unlike
// Replicate's pay-per-run models. This does real AI image editing -- actual
// re-lighting, mood, and atmosphere -- not just color-grading math.
// Docs: https://ai.google.dev/gemini-api/docs/image-generation

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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Server is missing GEMINI_API_KEY. See README.md.' },
        { status: 500 }
      );
    }

    // imageDataUrl looks like "data:image/jpeg;base64,AAAA..." -- Gemini
    // wants the raw base64 and mime type split apart.
    const match = imageDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }
    const [, mimeType, base64Data] = match;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // A clear, expert-level instruction: real transformation (lighting,
    // atmosphere, color, mood) while keeping the subject and composition
    // recognizable -- this is what makes it feel like "magic" rather than
    // a simple filter, without turning into a different photo entirely.
    const editPrompt = `You are an expert professional photo editor. Apply this exact treatment to the attached photo with real skill -- proper re-lighting, color grading, atmosphere, and mood, the way a professional retoucher would, not just a flat color filter:

${style.prompt}

Keep the same person/subject and overall composition recognizable -- this is a professional edit of this photo, not a different photo. Make it look genuinely expert and polished, not overdone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        { text: editPrompt },
        { inlineData: { data: base64Data, mimeType } },
      ],
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);

    if (!imagePart || !imagePart.inlineData) {
      const textPart = parts.find((p: any) => p.text);
      throw new Error(
        textPart?.text || 'The model did not return an edited image. Try again.'
      );
    }

    const resultMime = imagePart.inlineData.mimeType || 'image/png';
    const resultUrl = `data:${resultMime};base64,${imagePart.inlineData.data}`;

    return NextResponse.json({ resultUrl });
  } catch (err: any) {
    console.error('Style edit failed:', err);
    return NextResponse.json(
      { error: err?.message || 'Style edit failed' },
      { status: 500 }
    );
  }
}
