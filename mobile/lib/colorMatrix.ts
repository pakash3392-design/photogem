import { FilterRecipe } from '../constants/styles';

// Builds a 20-value SVG feColorMatrix (4 rows x 5 columns, row-major) from a
// FilterRecipe. SVG color matrices operate in normalized 0-1 color space,
// so pixel-space values (0-255) from the recipe are divided by 255.
//
// This mirrors the same contrast / saturation / warmth / tint / grayscale
// logic as the web app's lib/applyFilter.ts, just expressed as a single
// linear matrix instead of an imperative per-pixel loop -- the two engines
// are different implementations of the same idea, not identical algorithms,
// so results won't be pixel-for-pixel identical between platforms, but
// should look like the same style.
//
// Note: grain and vignette (recipe.grain / recipe.vignette) aren't
// expressible as a color matrix -- they're per-pixel noise and a radial
// overlay, not a linear transform. The mobile app currently applies color
// grading only; grain/vignette could be added later with a small overlay
// view or a shader if you want to match the web app more closely.

export function buildColorMatrix(recipe: FilterRecipe): number[] {
  const { warmth, tint, saturation, contrast, grayscale } = recipe;

  // Standard luminance-preserving saturation matrix coefficients.
  const s = grayscale ? 0 : saturation;
  const sr = [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s];
  const sg = [0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s];
  const sb = [0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s];

  // Fold contrast into the same linear scale, then compute this row's
  // offset (contrast midpoint shift + warmth/tint channel push).
  const contrastMidpoint = 0.5 * (1 - contrast);
  const warmthOffset = warmth / 255;
  const tintOffset = tint / 255;

  const rOffset = contrastMidpoint + warmthOffset - tintOffset * 0.15;
  const gOffset = contrastMidpoint + tintOffset * 0.4;
  const bOffset = contrastMidpoint - warmthOffset - tintOffset * 0.15;

  return [
    sr[0] * contrast, sr[1] * contrast, sr[2] * contrast, 0, rOffset,
    sg[0] * contrast, sg[1] * contrast, sg[2] * contrast, 0, gOffset,
    sb[0] * contrast, sb[1] * contrast, sb[2] * contrast, 0, bOffset,
    0, 0, 0, 1, 0,
  ];
}
