import { FilterRecipe } from './styles';

// Applies a FilterRecipe to an already-loaded HTMLImageElement entirely in
// the browser using the Canvas API -- no network call, no AI, no cost.
// This is real per-pixel color grading: brightness/contrast math, a
// saturation blend against luminance, a warmth/tint channel shift, an
// optional grayscale pass, plus a vignette and film-grain overlay drawn on
// top. Runs in well under a second even on large photos.

export function applyFilter(img: HTMLImageElement, recipe: FilterRecipe): string {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const { warmth, tint, saturation, contrast, grayscale } = recipe;
  const contrastOffset = 128 * (1 - contrast);

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Contrast: scale around the midpoint.
    r = r * contrast + contrastOffset;
    g = g * contrast + contrastOffset;
    b = b * contrast + contrastOffset;

    // Saturation: blend each channel toward the perceived luminance.
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    r = luma + (r - luma) * saturation;
    g = luma + (g - luma) * saturation;
    b = luma + (b - luma) * saturation;

    // Warmth (orange<->blue) and tint (magenta<->green).
    r += warmth;
    b -= warmth;
    g += tint * 0.4;
    r -= tint * 0.15;
    b -= tint * 0.15;

    if (grayscale) {
      const luma2 = 0.299 * r + 0.587 * g + 0.114 * b;
      r = luma2;
      g = luma2;
      b = luma2;
    }

    data[i] = clamp(r);
    data[i + 1] = clamp(g);
    data[i + 2] = clamp(b);
  }

  ctx.putImageData(imageData, 0, 0);

  if (recipe.vignette > 0) {
    const w = canvas.width;
    const h = canvas.height;
    const gradient = ctx.createRadialGradient(
      w / 2, h / 2, Math.min(w, h) * 0.35,
      w / 2, h / 2, Math.max(w, h) * 0.75
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0,0,0,${recipe.vignette})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }

  if (recipe.grain > 0) {
    const grainCanvas = document.createElement('canvas');
    const grainSize = 120;
    grainCanvas.width = grainSize;
    grainCanvas.height = grainSize;
    const gctx = grainCanvas.getContext('2d');
    if (gctx) {
      const grainData = gctx.createImageData(grainSize, grainSize);
      for (let i = 0; i < grainData.data.length; i += 4) {
        const v = Math.random() * 255;
        grainData.data[i] = v;
        grainData.data[i + 1] = v;
        grainData.data[i + 2] = v;
        grainData.data[i + 3] = 255;
      }
      gctx.putImageData(grainData, 0, 0);
      ctx.globalAlpha = recipe.grain;
      ctx.globalCompositeOperation = 'overlay';
      const pattern = ctx.createPattern(grainCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  if (recipe.letterbox) {
    const barHeight = canvas.height * 0.12;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, barHeight);
    ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, v));
}
