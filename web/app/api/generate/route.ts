import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { STYLE_PRESETS } from '@/lib/styles';

// This route receives the user's photo (as a data URL) + a style id,
// sends both to Replicate's Flux Kontext Pro model, and returns the
// styled result URL.
//
// Flux Kontext Pro edits an existing photo directly from a text prompt --
// it doesn't need a separate "style reference" image the way some older
// style-transfer models do. Our style.prompt (written for each of the 68
// looks in lib/styles.ts) IS the instruction the model follows.
// Docs: https://replicate.com/black-forest-labs/flux-kontext-pro

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

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Server is missing REPLICATE_API_TOKEN. See README.md.' },
        { status: 500 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // "black-forest-labs/flux-kontext-pro" with no :version pins to Replicate's
    // official model, which always resolves to their current stable version --
    // no version hash to look up or keep updated. Override via env var if you
    // ever want to pin a specific version or swap models.
    const MODEL = process.env.REPLICATE_MODEL_VERSION || 'black-forest-labs/flux-kontext-pro';

    // Flux Kontext works best with a direct, specific instruction. Style
    // prompts in lib/styles.ts were written to describe a *mood* for the
    // style-picker thumbnails, and often mention scenery (e.g. "wheat-field
    // background") that described the reference photo, not an instruction
    // to change the user's photo. Left as-is, the model reads that literally
    // and starts altering the background/scene. This instruction explicitly
    // tells it to treat the style prompt as color/light/grain treatment only,
    // and never touch the subject, background, or composition.
    const editPrompt = `Apply a strong, clearly visible color grade and lighting treatment to this exact photo -- this should look like a bold, professional photo filter, not a barely-there tweak. Push the color grading, contrast, and tone noticeably in the direction described below.

Do NOT change the subject, the background, or any objects in the scene. Do NOT add, remove, or replace anything, and do NOT change the composition or framing -- only the color, light, contrast, and grain should shift.

Apply this treatment boldly (ignore any mention of scenery, location, or background in the description -- use only its color, tone, lighting, contrast, and film-grain qualities): ${style.prompt}`;

    const output = await replicate.run(MODEL as `${string}/${string}`, {
      input: {
        prompt: editPrompt,
        input_image: imageDataUrl,
        aspect_ratio: 'match_input_image',
        output_format: 'png',
      },
    });

    // Replicate's JS client returns a FileOutput object with a .url() method
    // for this model; older-style models return an array or plain string.
    // Handle all three so this route doesn't break if you swap models later.
    let resultUrl: string;
    if (Array.isArray(output)) {
      resultUrl = output[0];
    } else if (output && typeof (output as any).url === 'function') {
      resultUrl = (output as any).url().toString();
    } else {
      resultUrl = output as unknown as string;
    }

    return NextResponse.json({ resultUrl });
  } catch (err: any) {
    console.error('Style transfer failed:', err);
    return NextResponse.json(
      { error: err?.message || 'Style transfer failed' },
      { status: 500 }
    );
  }
}
