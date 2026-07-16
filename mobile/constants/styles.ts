// Keep this in sync with photo-style-app/lib/styles.ts (the web app).
// previewTint/previewOpacity are used only for the live camera preview -- a rough
// color approximation, not the real AI result (see CameraScreen.tsx).

export type FilterRecipe = {
  grayscale: boolean;
  warmth: number;
  tint: number;
  saturation: number;
  contrast: number;
  grain: number;
  vignette: number;
  letterbox: boolean;
};

export type StylePreset = {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  referenceImage: string;
  prompt: string;
  previewTint: string;
  previewOpacity: number;
  previewDesaturate?: boolean;
  filter: FilterRecipe; // the real, code-applied color-grading recipe
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'studio-softlight',
    name: 'Studio Softlight',
    code: 'SP-050',
    category: 'Portrait',
    description: 'Clean studio light, soft shadows, creamy bokeh',
    referenceImage: 'https://picsum.photos/seed/studio-softlight/600/400',
    prompt:
      'professional studio portrait lighting, large softbox key light, smooth even skin tones, creamy shallow-depth-of-field bokeh, clean neutral background',
    previewTint: '#F5E6D8',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 7.0, tint: 1.8, saturation: 0.83, contrast: 0.9, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    code: 'GH-100',
    category: 'Portrait',
    description: 'Warm, soft backlight with a gentle glow',
    referenceImage: 'https://picsum.photos/seed/golden-hour/600/400',
    prompt:
      'warm golden hour lighting, soft glowing backlight, gentle lens flare, warm amber and honey tones, soft contrast, cinematic portrait photography',
    previewTint: '#FFAA55',
    previewOpacity: 0.18,
    filter: { grayscale: false, warmth: 12.6, tint: 3.2, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'natural-light',
    name: 'Natural Window Light',
    code: 'NL-220',
    category: 'Portrait',
    description: 'Soft indoor window light, quiet and intimate',
    referenceImage: 'https://picsum.photos/seed/natural-light/600/400',
    prompt:
      'soft natural window light portrait, gentle falloff, intimate quiet mood, true-to-life skin tones, subtle shadow gradient',
    previewTint: '#E8E0D0',
    previewOpacity: 0.08,
    filter: { grayscale: false, warmth: 5.6, tint: 1.4, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.28, letterbox: false },
  },
  {
    id: 'fine-art-bw-portrait',
    name: 'Fine Art Mono Portrait',
    code: 'FA-071',
    category: 'Portrait',
    description: 'Sculptural black & white, gallery quality',
    referenceImage: 'https://picsum.photos/seed/fine-art-bw-portrait/600/400',
    prompt:
      'fine art black and white portrait photography, sculptural directional lighting, deep tonal range, gallery print quality, timeless composition',
    previewTint: '#000000',
    previewOpacity: 0.3,
    previewDesaturate: true,
    filter: { grayscale: true, warmth: 21.0, tint: 5.4, saturation: 0.0, contrast: 1.05, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'high-key-portrait',
    name: 'High Key Bright',
    code: 'HK-500',
    category: 'Portrait',
    description: 'Bright white background, soft even light',
    referenceImage: 'https://picsum.photos/seed/high-key-portrait/600/400',
    prompt:
      'high key portrait photography, bright white seamless background, soft even lighting, minimal shadow, clean commercial look',
    previewTint: '#FFFFFF',
    previewOpacity: 0.15,
    filter: { grayscale: false, warmth: 10.5, tint: 2.7, saturation: 0.83, contrast: 0.9, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'epic-landscape',
    name: 'Epic Landscape',
    code: 'LS-064',
    category: 'Landscape',
    description: 'Dramatic wide vista, rich sky detail',
    referenceImage: 'https://picsum.photos/seed/epic-landscape/600/400',
    prompt:
      'dramatic wide landscape photography, rich detailed sky, deep saturated natural colors, crisp foreground-to-background sharpness, golden light on the horizon',
    previewTint: '#E8A55C',
    previewOpacity: 0.12,
    filter: { grayscale: false, warmth: 8.4, tint: 2.2, saturation: 1.27, contrast: 1.3, grain: 0.04, vignette: 0.28, letterbox: false },
  },
  {
    id: 'night-trails',
    name: 'Night Long Exposure',
    code: 'NT-030',
    category: 'Landscape',
    description: 'Blue hour, light trails, city glow',
    referenceImage: 'https://picsum.photos/seed/night-trails/600/400',
    prompt:
      'long exposure night photography, deep blue hour sky, streaking light trails, glowing city lights, sharp stationary subject with motion blur background',
    previewTint: '#1A2A4A',
    previewOpacity: 0.25,
    filter: { grayscale: false, warmth: -13.8, tint: 4.5, saturation: 1.05, contrast: 1.05, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'misty-forest',
    name: 'Misty Forest',
    code: 'MF-140',
    category: 'Landscape',
    description: 'Soft fog, muted greens, quiet stillness',
    referenceImage: 'https://picsum.photos/seed/misty-forest/600/400',
    prompt:
      'misty forest photography, soft atmospheric fog, muted desaturated greens, quiet still mood, diffused light through trees',
    previewTint: '#8FA894',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: 1.6, tint: 2.9, saturation: 1.05, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'desert-minimal',
    name: 'Desert Minimal',
    code: 'DM-310',
    category: 'Landscape',
    description: 'Vast negative space, warm sand tones',
    referenceImage: 'https://picsum.photos/seed/desert-minimal/600/400',
    prompt:
      'minimalist desert landscape photography, vast negative space, warm sand and terracotta tones, clean simple composition, sharp midday clarity',
    previewTint: '#D6A15C',
    previewOpacity: 0.14,
    filter: { grayscale: false, warmth: 9.8, tint: 2.5, saturation: 1.05, contrast: 1.05, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'ocean-blue-hour',
    name: 'Ocean Blue Hour',
    code: 'OB-410',
    category: 'Landscape',
    description: 'Cool coastal light just after sunset',
    referenceImage: 'https://picsum.photos/seed/ocean-blue-hour/600/400',
    prompt:
      'blue hour coastal seascape photography, cool cyan and indigo tones, long exposure smoothed water, calm serene atmosphere',
    previewTint: '#2E5C7A',
    previewOpacity: 0.18,
    filter: { grayscale: false, warmth: -9.9, tint: 3.2, saturation: 1.05, contrast: 1.05, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'documentary-street',
    name: 'Documentary Street',
    code: 'DS-800',
    category: 'Street',
    description: 'Grainy candid black & white street shots',
    referenceImage: 'https://picsum.photos/seed/documentary-street/600/400',
    prompt:
      'candid black and white documentary street photography, visible film grain, natural available light, unposed authentic moment, high ISO texture',
    previewTint: '#000000',
    previewOpacity: 0.28,
    previewDesaturate: true,
    filter: { grayscale: true, warmth: 19.6, tint: 5.0, saturation: 0.0, contrast: 1.05, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'direct-flash',
    name: 'Direct Flash',
    code: 'DF-016',
    category: 'Street',
    description: 'Raw on-camera flash, harsh and immediate',
    referenceImage: 'https://picsum.photos/seed/direct-flash/600/400',
    prompt:
      'raw on-camera direct flash photography, harsh immediate lighting, deep hard shadows behind the subject, slightly overexposed skin, punchy contrast, contemporary editorial look',
    previewTint: '#FFFFFF',
    previewOpacity: 0.12,
    filter: { grayscale: false, warmth: 8.4, tint: 2.2, saturation: 1.27, contrast: 1.3, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'neon-night-street',
    name: 'Neon Night Street',
    code: 'NS-660',
    category: 'Street',
    description: 'Wet pavement, neon signage reflections',
    referenceImage: 'https://picsum.photos/seed/neon-night-street/600/400',
    prompt:
      'neon-lit night street photography, colorful sign reflections on wet pavement, moody urban atmosphere, rich shadow detail',
    previewTint: '#6A2E8A',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: -11.0, tint: 3.6, saturation: 1.27, contrast: 1.05, grain: 0.04, vignette: 0.28, letterbox: false },
  },
  {
    id: 'rainy-reflections',
    name: 'Rainy Reflections',
    code: 'RR-090',
    category: 'Street',
    description: 'Muted grey tones, umbrella silhouettes, puddles',
    referenceImage: 'https://picsum.photos/seed/rainy-reflections/600/400',
    prompt:
      'rainy day street photography, muted grey color palette, reflective puddles, soft diffused overcast light, quiet melancholic mood',
    previewTint: '#7A8A94',
    previewOpacity: 0.15,
    filter: { grayscale: false, warmth: -8.2, tint: 2.7, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'candid-grain',
    name: 'Candid 35mm Grain',
    code: 'CG-035',
    category: 'Street',
    description: 'Punchy color, visible grain, snapshot energy',
    referenceImage: 'https://picsum.photos/seed/candid-grain/600/400',
    prompt:
      '35mm candid street photography, punchy saturated color, visible film grain, spontaneous snapshot energy, slight vignette',
    previewTint: '#C77D4B',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 7.0, tint: 1.8, saturation: 1.27, contrast: 1.3, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'moody-romantic',
    name: 'Moody Romantic',
    code: 'WD-120',
    category: 'Wedding',
    description: 'Dark, intimate, low-key wedding tones',
    referenceImage: 'https://picsum.photos/seed/moody-romantic/600/400',
    prompt:
      'moody romantic wedding photography, low-key lighting, deep warm shadows, intimate candlelit atmosphere, rich muted color grade',
    previewTint: '#3A2418',
    previewOpacity: 0.22,
    filter: { grayscale: false, warmth: 15.4, tint: 4.0, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.28, letterbox: false },
  },
  {
    id: 'bright-airy',
    name: 'Bright & Airy',
    code: 'WD-400',
    category: 'Wedding',
    description: 'Light, soft pastels, gently overexposed',
    referenceImage: 'https://picsum.photos/seed/bright-airy/600/400',
    prompt:
      'bright and airy wedding photography, soft pastel color palette, gentle overexposed highlights, light and delicate mood, clean white tones',
    previewTint: '#F5EFE8',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 7.0, tint: 1.8, saturation: 0.83, contrast: 0.9, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'timeless-classic',
    name: 'Timeless Classic',
    code: 'WD-210',
    category: 'Wedding',
    description: 'Balanced, elegant, true-to-life color',
    referenceImage: 'https://picsum.photos/seed/timeless-classic/600/400',
    prompt:
      'timeless classic wedding photography, balanced natural color, elegant soft light, true-to-life skin tones, understated refined mood',
    previewTint: '#E0D5C0',
    previewOpacity: 0.08,
    filter: { grayscale: false, warmth: 5.6, tint: 1.4, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'documentary-wedding',
    name: 'Documentary Wedding',
    code: 'WD-540',
    category: 'Wedding',
    description: 'Unposed candid moments, journalistic feel',
    referenceImage: 'https://picsum.photos/seed/documentary-wedding/600/400',
    prompt:
      'documentary style wedding photography, unposed candid moments, natural available light, journalistic authentic feel, minimal retouching look',
    previewTint: '#D8C8B0',
    previewOpacity: 0.09,
    filter: { grayscale: false, warmth: 6.3, tint: 1.6, saturation: 1.05, contrast: 1.05, grain: 0.04, vignette: 0.04, letterbox: false },
  },
  {
    id: 'editorial-fashion',
    name: 'Editorial Fashion',
    code: 'ED-300',
    category: 'Fashion',
    description: 'High-contrast strobe light, bold and graphic',
    referenceImage: 'https://picsum.photos/seed/editorial-fashion/600/400',
    prompt:
      'high fashion editorial photography, bold high-contrast strobe lighting, sharp shadows, graphic composition, vibrant saturated color, magazine cover quality',
    previewTint: '#8A1E3A',
    previewOpacity: 0.18,
    filter: { grayscale: false, warmth: 12.6, tint: 3.2, saturation: 1.27, contrast: 1.3, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'high-fashion-bw',
    name: 'High Fashion Mono',
    code: 'HF-620',
    category: 'Fashion',
    description: 'Sculpted black & white, couture editorial',
    referenceImage: 'https://picsum.photos/seed/high-fashion-bw/600/400',
    prompt:
      'high fashion black and white editorial photography, sculpted dramatic lighting, deep contrast, couture magazine quality, sharp graphic shadows',
    previewTint: '#000000',
    previewOpacity: 0.3,
    previewDesaturate: true,
    filter: { grayscale: true, warmth: 21.0, tint: 5.4, saturation: 0.0, contrast: 1.3, grain: 0.04, vignette: 0.28, letterbox: false },
  },
  {
    id: 'streetwear-editorial',
    name: 'Streetwear Editorial',
    code: 'SW-450',
    category: 'Fashion',
    description: 'Gritty urban backdrop, bold saturated color',
    referenceImage: 'https://picsum.photos/seed/streetwear-editorial/600/400',
    prompt:
      'streetwear fashion editorial photography, gritty urban backdrop, bold saturated color grade, confident dynamic pose energy, contemporary style',
    previewTint: '#2A4A5A',
    previewOpacity: 0.14,
    filter: { grayscale: false, warmth: -7.7, tint: 2.5, saturation: 1.27, contrast: 1.3, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'beauty-clean',
    name: 'Clean Beauty',
    code: 'BC-080',
    category: 'Fashion',
    description: 'Soft glowing skin, minimal bright backdrop',
    referenceImage: 'https://picsum.photos/seed/beauty-clean/600/400',
    prompt:
      'clean beauty photography, soft glowing even skin, minimal bright backdrop, gentle catchlight in eyes, commercial beauty campaign quality',
    previewTint: '#FFF2E8',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 7.0, tint: 1.8, saturation: 0.83, contrast: 0.9, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'portra-film',
    name: 'Portra Film',
    code: 'PT-160',
    category: 'Film & Vintage',
    description: 'Soft, warm, nostalgic analog film look',
    referenceImage: 'https://picsum.photos/seed/portra-film/600/400',
    prompt:
      'shot on Kodak Portra 400 film, soft warm tones, gentle film grain, muted pastel colors, nostalgic analog photography look',
    previewTint: '#E8C4A0',
    previewOpacity: 0.14,
    filter: { grayscale: false, warmth: 9.8, tint: 2.5, saturation: 0.83, contrast: 0.9, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'retro-80s',
    name: 'Retro 80s',
    code: 'RT-085',
    category: 'Film & Vintage',
    description: 'Saturated color, warm sun flare, VHS-era feel',
    referenceImage: 'https://picsum.photos/seed/retro-80s/600/400',
    prompt:
      '1980s retro film photography, saturated warm color palette, soft sun flare, slight halation glow, nostalgic vintage grain',
    previewTint: '#D6663C',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: 11.2, tint: 2.9, saturation: 1.05, contrast: 0.9, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'sepia-vintage',
    name: 'Sepia Vintage',
    code: 'SV-190',
    category: 'Film & Vintage',
    description: 'Old-world sepia tone, timeless portrait',
    referenceImage: 'https://picsum.photos/seed/sepia-vintage/600/400',
    prompt:
      'antique sepia toned photograph, soft vignette, timeless old-world portrait style, subtle scratches and grain, warm brown monochrome tones',
    previewTint: '#8A6238',
    previewOpacity: 0.3,
    filter: { grayscale: false, warmth: 21.0, tint: 5.4, saturation: 0.83, contrast: 0.9, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'kodachrome-pop',
    name: 'Kodachrome Pop',
    code: 'KC-064',
    category: 'Film & Vintage',
    description: 'Punchy saturated primary colors, 1960s feel',
    referenceImage: 'https://picsum.photos/seed/kodachrome-pop/600/400',
    prompt:
      'shot on Kodachrome film, punchy saturated primary colors, warm midcentury color palette, fine grain, nostalgic 1960s look',
    previewTint: '#C4442A',
    previewOpacity: 0.14,
    filter: { grayscale: false, warmth: 9.8, tint: 2.5, saturation: 1.27, contrast: 1.3, grain: 0.03, vignette: 0.1, letterbox: false },
  },
  {
    id: 'bw-film-classic',
    name: 'Classic Film Mono',
    code: 'FC-125',
    category: 'Film & Vintage',
    description: 'Rich tonal range, classic silver gelatin look',
    referenceImage: 'https://picsum.photos/seed/bw-film-classic/600/400',
    prompt:
      'classic black and white film photography, rich tonal range, silver gelatin print quality, timeless documentary aesthetic, fine grain',
    previewTint: '#000000',
    previewOpacity: 0.26,
    previewDesaturate: true,
    filter: { grayscale: true, warmth: 18.2, tint: 4.7, saturation: 0.0, contrast: 1.05, grain: 0.03, vignette: 0.1, letterbox: false },
  },
  {
    id: 'faded-polaroid',
    name: 'Faded Polaroid',
    code: 'FP-600',
    category: 'Film & Vintage',
    description: 'Soft washed color, light leak, square crop feel',
    referenceImage: 'https://picsum.photos/seed/faded-polaroid/600/400',
    prompt:
      'faded polaroid instant film photography, soft washed out color, gentle light leak, low contrast, nostalgic square-format mood',
    previewTint: '#C9B896',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: 14.0, tint: 3.6, saturation: 0.83, contrast: 0.9, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    code: 'CN-250',
    category: 'Cinematic',
    description: 'Teal shadows, orange skin tones',
    referenceImage: 'https://picsum.photos/seed/teal-orange/600/400',
    prompt:
      'cinematic color grade, teal and orange color grading, film-like contrast, blockbuster movie still, shallow depth of field',
    previewTint: '#1E8A8A',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: -8.8, tint: 2.9, saturation: 1.05, contrast: 1.05, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'blockbuster-action',
    name: 'Blockbuster Action',
    code: 'BA-720',
    category: 'Cinematic',
    description: 'High contrast, dramatic haze, epic scale',
    referenceImage: 'https://picsum.photos/seed/blockbuster-action/600/400',
    prompt:
      'blockbuster action movie still, high contrast dramatic lighting, atmospheric haze, epic sense of scale, desaturated shadows with warm highlights',
    previewTint: '#3A3A2A',
    previewOpacity: 0.18,
    filter: { grayscale: false, warmth: 12.6, tint: 3.2, saturation: 1.27, contrast: 1.3, grain: 0.04, vignette: 0.28, letterbox: false },
  },
  {
    id: 'indie-drama',
    name: 'Indie Drama',
    code: 'ID-380',
    category: 'Cinematic',
    description: 'Muted natural color, soft handheld intimacy',
    referenceImage: 'https://picsum.photos/seed/indie-drama/600/400',
    prompt:
      'independent drama film still, muted natural color grade, soft handheld intimacy, gentle grain, understated realistic lighting',
    previewTint: '#7A7264',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 7.0, tint: 1.8, saturation: 0.83, contrast: 0.9, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'scifi-cool',
    name: 'Sci-Fi Cool',
    code: 'SF-990',
    category: 'Cinematic',
    description: 'Cold blue tones, clinical futuristic light',
    referenceImage: 'https://picsum.photos/seed/scifi-cool/600/400',
    prompt:
      'science fiction film still, cold blue and cyan color grade, clinical futuristic lighting, sharp clean contrast, sleek atmosphere',
    previewTint: '#2A4A6A',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: -11.0, tint: 3.6, saturation: 1.05, contrast: 1.05, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'warm-drama',
    name: 'Warm Drama',
    code: 'WM-215',
    category: 'Cinematic',
    description: 'Amber tones, soft shadow falloff, intimate',
    referenceImage: 'https://picsum.photos/seed/warm-drama/600/400',
    prompt:
      'warm dramatic film still, amber and copper color grade, soft shadow falloff, intimate emotional lighting, rich film-like contrast',
    previewTint: '#A8622E',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: 11.2, tint: 2.9, saturation: 0.83, contrast: 1.15, grain: 0.16, vignette: 0.28, letterbox: false },
  },
  {
    id: 'film-noir',
    name: 'Film Noir',
    code: 'NR-400',
    category: 'Black & White',
    description: 'High contrast black & white, deep shadows',
    referenceImage: 'https://picsum.photos/seed/film-noir/600/400',
    prompt:
      'high contrast black and white film noir photography, deep dramatic shadows, sharp directional light, moody atmosphere, fine film grain',
    previewTint: '#000000',
    previewOpacity: 0.35,
    previewDesaturate: true,
    filter: { grayscale: true, warmth: 24.5, tint: 6.3, saturation: 0.0, contrast: 1.3, grain: 0.16, vignette: 0.28, letterbox: false },
  },
  {
    id: 'high-contrast-mono',
    name: 'High Contrast Mono',
    code: 'HC-810',
    category: 'Black & White',
    description: 'Bold blacks and whites, minimal grey',
    referenceImage: 'https://picsum.photos/seed/high-contrast-mono/600/400',
    prompt:
      'high contrast black and white photography, bold pure blacks and whites, minimal mid-grey detail, graphic striking composition',
    previewTint: '#000000',
    previewOpacity: 0.32,
    previewDesaturate: true,
    filter: { grayscale: true, warmth: 22.4, tint: 5.8, saturation: 0.0, contrast: 1.3, grain: 0.04, vignette: 0.04, letterbox: false },
  },
  {
    id: 'soft-mono-portrait',
    name: 'Soft Mono Portrait',
    code: 'SM-045',
    category: 'Black & White',
    description: 'Gentle greyscale, low contrast, romantic',
    referenceImage: 'https://picsum.photos/seed/soft-mono-portrait/600/400',
    prompt:
      'soft low-contrast black and white portrait, gentle greyscale gradient, romantic diffused light, delicate tonal range',
    previewTint: '#555555',
    previewOpacity: 0.24,
    previewDesaturate: true,
    filter: { grayscale: true, warmth: 16.8, tint: 4.3, saturation: 0.0, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'grainy-doc-mono',
    name: 'Grainy Documentary Mono',
    code: 'GD-720',
    category: 'Black & White',
    description: 'Rough push-processed grain, raw and honest',
    referenceImage: 'https://picsum.photos/seed/grainy-doc-mono/600/400',
    prompt:
      'grainy push-processed black and white documentary photography, rough raw texture, honest unpolished mood, high ISO grain structure',
    previewTint: '#333333',
    previewOpacity: 0.28,
    previewDesaturate: true,
    filter: { grayscale: true, warmth: 19.6, tint: 5.0, saturation: 0.0, contrast: 1.05, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'infrared-dream',
    name: 'Infrared Dream',
    code: 'IR-720',
    category: 'Experimental',
    description: 'Surreal pink-white foliage, dreamlike glow',
    referenceImage: 'https://picsum.photos/seed/infrared-dream/600/400',
    prompt:
      'surreal infrared photography, glowing white and pink foliage, dreamlike ethereal atmosphere, high contrast sky, otherworldly color shift',
    previewTint: '#E896C8',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: 14.0, tint: 3.6, saturation: 1.05, contrast: 1.3, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'double-exposure',
    name: 'Double Exposure',
    code: 'DE-333',
    category: 'Experimental',
    description: 'Layered ghostly imagery, artistic blend',
    referenceImage: 'https://picsum.photos/seed/double-exposure/600/400',
    prompt:
      'artistic double exposure photography, layered ghostly translucent imagery, creative blended composition, dreamlike surreal mood',
    previewTint: '#5A4A7A',
    previewOpacity: 0.18,
    filter: { grayscale: false, warmth: -9.9, tint: 3.2, saturation: 1.05, contrast: 1.05, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'light-leak',
    name: 'Light Leak',
    code: 'LL-777',
    category: 'Experimental',
    description: 'Warm streaks of overexposed light, lo-fi',
    referenceImage: 'https://picsum.photos/seed/light-leak/600/400',
    prompt:
      'lo-fi analog photography with warm light leak streaks, overexposed color bleed, nostalgic imperfect charm, soft glow',
    previewTint: '#E8843C',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: 14.0, tint: 3.6, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'glitch-chrome',
    name: 'Glitch Chrome',
    code: 'GC-999',
    category: 'Experimental',
    description: 'Digital distortion, chromatic aberration, futuristic',
    referenceImage: 'https://picsum.photos/seed/glitch-chrome/600/400',
    prompt:
      'digital glitch art photography, chromatic aberration distortion, futuristic data-corruption aesthetic, bold electric color shifts',
    previewTint: '#3AE8C8',
    previewOpacity: 0.18,
    filter: { grayscale: false, warmth: -9.9, tint: 3.2, saturation: 1.27, contrast: 1.3, grain: 0.03, vignette: 0.1, letterbox: false },
  },
  {
    id: 'golden-savanna',
    name: 'Golden Savanna',
    code: 'GS-440',
    category: 'Nature & Wildlife',
    description: 'Warm dusty light, wide open wilderness',
    referenceImage: 'https://picsum.photos/seed/golden-savanna/600/400',
    prompt:
      'golden hour savanna wildlife photography, warm dusty backlight, wide open wilderness feel, rich earth tones, sharp subject focus',
    previewTint: '#C89452',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: 11.2, tint: 2.9, saturation: 1.05, contrast: 1.05, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'macro-detail',
    name: 'Macro Detail',
    code: 'MD-012',
    category: 'Nature & Wildlife',
    description: 'Extreme close-up, soft blurred background',
    referenceImage: 'https://picsum.photos/seed/macro-detail/600/400',
    prompt:
      'macro nature photography, extreme close-up detail, soft creamy blurred background, vivid natural color, crisp fine texture',
    previewTint: '#6A9452',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 1.0, tint: 1.8, saturation: 1.05, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'underwater-blue',
    name: 'Underwater Blue',
    code: 'UW-280',
    category: 'Nature & Wildlife',
    description: 'Cool aquatic tones, soft diffused light',
    referenceImage: 'https://picsum.photos/seed/underwater-blue/600/400',
    prompt:
      'underwater photography, cool aquatic blue tones, soft diffused filtered light, gentle particulate atmosphere, serene submerged mood',
    previewTint: '#1E5A7A',
    previewOpacity: 0.22,
    filter: { grayscale: false, warmth: -12.1, tint: 4.0, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'minimalist-concrete',
    name: 'Minimalist Concrete',
    code: 'MC-501',
    category: 'Architecture',
    description: 'Clean geometry, muted grey tones',
    referenceImage: 'https://picsum.photos/seed/minimalist-concrete/600/400',
    prompt:
      'minimalist architecture photography, clean strong geometry, muted grey and concrete tones, negative space, sharp structural lines',
    previewTint: '#8A8A82',
    previewOpacity: 0.14,
    filter: { grayscale: false, warmth: 9.8, tint: 2.5, saturation: 0.83, contrast: 0.9, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'symmetry-glass',
    name: 'Symmetry & Glass',
    code: 'SG-334',
    category: 'Architecture',
    description: 'Reflective surfaces, precise symmetrical framing',
    referenceImage: 'https://picsum.photos/seed/symmetry-glass/600/400',
    prompt:
      'symmetrical architecture photography, reflective glass surfaces, precise centered framing, cool clean color palette, modern structural elegance',
    previewTint: '#4A6A8A',
    previewOpacity: 0.14,
    filter: { grayscale: false, warmth: -7.7, tint: 2.5, saturation: 1.05, contrast: 1.05, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'urban-geometry',
    name: 'Urban Geometry',
    code: 'UG-670',
    category: 'Architecture',
    description: 'Bold shadows, graphic angular composition',
    referenceImage: 'https://picsum.photos/seed/urban-geometry/600/400',
    prompt:
      'urban geometric architecture photography, bold hard shadows, graphic angular composition, high contrast midday light, striking abstract forms',
    previewTint: '#5A5A5A',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: 11.2, tint: 2.9, saturation: 1.27, contrast: 1.3, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    code: 'CP-808',
    category: 'Night & Urban',
    description: 'Saturated neon glow, futuristic night city',
    referenceImage: 'https://picsum.photos/seed/cyberpunk-neon/600/400',
    prompt:
      'cyberpunk night city photography, saturated pink and blue neon glow, futuristic atmosphere, reflective wet streets, moody dramatic light',
    previewTint: '#9A2A9A',
    previewOpacity: 0.24,
    filter: { grayscale: false, warmth: 16.8, tint: 4.3, saturation: 1.27, contrast: 1.3, grain: 0.04, vignette: 0.28, letterbox: false },
  },
  {
    id: 'blue-hour-city',
    name: 'Blue Hour City',
    code: 'BH-360',
    category: 'Night & Urban',
    description: 'Deep blue sky, warm window lights',
    referenceImage: 'https://picsum.photos/seed/blue-hour-city/600/400',
    prompt:
      'blue hour city skyline photography, deep saturated blue sky, warm glowing window lights, balanced twilight exposure, calm urban mood',
    previewTint: '#2A3A6A',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: -11.0, tint: 3.6, saturation: 1.27, contrast: 1.05, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'windswept-gold',
    name: 'Windswept Gold',
    code: 'WG-057',
    category: 'Portrait',
    description: 'Hazy backlit sun, windblown hair, muted rust tones',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/windswept-gold.jpg'
    referenceImage: 'https://picsum.photos/seed/windswept-gold/600/400',
    prompt:
      'hazy golden hour backlit portrait, strong warm sun flare and diffused haze, windblown loose hair catching the light, muted rust and terracotta wardrobe tones, soft creamy out-of-focus wheat-field background, intimate candid mood, gentle film-like warmth',
    previewTint: '#E8A560',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: 14.0, tint: 3.6, saturation: 0.83, contrast: 0.9, grain: 0.16, vignette: 0.28, letterbox: false },
  },
  {
    id: 'dusk-city-overlook',
    name: 'Dusk City Overlook',
    code: 'DC-141',
    category: 'Night & Urban',
    description: 'Pink dusk sky, hazy city-light bokeh below',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/dusk-city-overlook.jpg'
    referenceImage: 'https://picsum.photos/seed/dusk-city-overlook/600/400',
    prompt:
      'dusk portrait overlooking a city skyline, warm pink and coral sunset sky, soft hazy bokeh from distant city lights, gentle glow, quiet contemplative mood',
    previewTint: '#D97A6A',
    previewOpacity: 0.18,
    filter: { grayscale: false, warmth: 12.6, tint: 3.2, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'storm-light-silhouette',
    name: 'Storm Light Silhouette',
    code: 'SL-286',
    category: 'Landscape',
    description: 'Moody storm sky, small figure, dramatic scale',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/storm-light-silhouette.jpg'
    referenceImage: 'https://picsum.photos/seed/storm-light-silhouette/600/400',
    prompt:
      'dramatic moody landscape portrait, small silhouetted figure against a vast storm-lit sky, soft pink light breaking through heavy clouds, cinematic sense of scale',
    previewTint: '#5A6478',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: -11.0, tint: 3.6, saturation: 0.83, contrast: 1.15, grain: 0.04, vignette: 0.28, letterbox: false },
  },
  {
    id: 'aisle-walk-documentary',
    name: 'Aisle Walk Documentary',
    code: 'AW-333',
    category: 'Wedding',
    description: 'Candid ceremony walk, natural muted outdoor light',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/aisle-walk-documentary.jpg'
    referenceImage: 'https://picsum.photos/seed/aisle-walk-documentary/600/400',
    prompt:
      'candid documentary wedding ceremony photography, natural muted outdoor light, genuine unposed emotion, soft desaturated color grade, authentic journalistic feel',
    previewTint: '#8A9482',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 1.0, tint: 1.8, saturation: 1.05, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'boho-field-romance',
    name: 'Boho Field Romance',
    code: 'BF-517',
    category: 'Wedding',
    description: 'Bright hazy field, flowing fabric, soft romance',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/boho-field-romance.jpg'
    referenceImage: 'https://picsum.photos/seed/boho-field-romance/600/400',
    prompt:
      'bright hazy golden field engagement photography, soft overexposed highlights, flowing romantic fabric movement, dreamy diffused backlight, warm airy color grade',
    previewTint: '#E0D0A0',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: 11.2, tint: 2.9, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.04, letterbox: false },
  },
  {
    id: 'suburban-sunbright',
    name: 'Suburban Sunbright',
    code: 'SB-024',
    category: 'Lifestyle',
    description: 'Crisp blue sky, saturated everyday color, clean light',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/suburban-sunbright.jpg'
    referenceImage: 'https://picsum.photos/seed/suburban-sunbright/600/400',
    prompt:
      'bright clean suburban lifestyle photography, crisp saturated blue sky, punchy true-to-life color, sharp midday clarity, warm nostalgic everyday feel',
    previewTint: '#3A8AC4',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: -5.5, tint: 1.8, saturation: 1.27, contrast: 1.3, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'soft-sand-maternity',
    name: 'Soft Sand Maternity',
    code: 'SS-462',
    category: 'Wedding',
    description: 'Warm beach tones, gentle embrace, soft highlights',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/soft-sand-maternity.jpg'
    referenceImage: 'https://picsum.photos/seed/soft-sand-maternity/600/400',
    prompt:
      'soft warm beach maternity photography, gentle sandy neutral tones, tender embrace, soft glowing highlights, intimate serene mood',
    previewTint: '#E8DCC8',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 7.0, tint: 1.8, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.28, letterbox: false },
  },
  {
    id: 'sunwashed-lace',
    name: 'Sunwashed Lace',
    code: 'SW-708',
    category: 'Fashion',
    description: 'Warm terracotta backdrop, soft sunlit texture',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/sunwashed-lace.jpg'
    referenceImage: 'https://picsum.photos/seed/sunwashed-lace/600/400',
    prompt:
      'sunwashed fashion portrait, warm terracotta and peach backdrop, soft directional sunlight, delicate lace texture detail, relaxed editorial elegance',
    previewTint: '#E0A878',
    previewOpacity: 0.14,
    filter: { grayscale: false, warmth: 9.8, tint: 2.5, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'power-red-editorial',
    name: 'Power Red Editorial',
    code: 'PR-901',
    category: 'Fashion',
    description: 'Bold saturated red, confident street energy',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/power-red-editorial.jpg'
    referenceImage: 'https://picsum.photos/seed/power-red-editorial/600/400',
    prompt:
      'bold fashion street editorial photography, saturated confident red color story, dynamic walking energy, graphic architectural backdrop, vibrant punchy contrast',
    previewTint: '#B0202A',
    previewOpacity: 0.18,
    filter: { grayscale: false, warmth: 12.6, tint: 3.2, saturation: 1.27, contrast: 1.3, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'wildflower-freckles',
    name: 'Wildflower Freckles',
    code: 'WF-233',
    category: 'Portrait',
    description: 'Close natural light, lush green, soft detail',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/wildflower-freckles.jpg'
    referenceImage: 'https://picsum.photos/seed/wildflower-freckles/600/400',
    prompt:
      'intimate close-up natural light portrait, lush green foliage backdrop, soft wildflowers in foreground, true-to-life skin texture and detail, warm gentle sunlight',
    previewTint: '#7A9452',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 1.0, tint: 1.8, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.28, letterbox: false },
  },
  {
    id: 'moodboard-collage',
    name: 'Moodboard Collage',
    code: 'MB-654',
    category: 'Experimental',
    description: 'Layered warm-toned photo collage, dreamy scrapbook feel',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/moodboard-collage.jpg'
    referenceImage: 'https://picsum.photos/seed/moodboard-collage/600/400',
    prompt:
      'warm-toned aesthetic photo collage composition, layered overlapping polaroid-style frames, dreamy scrapbook mood, soft vintage color grade, decorative floral accents',
    previewTint: '#9A6A4A',
    previewOpacity: 0.18,
    filter: { grayscale: false, warmth: 12.6, tint: 3.2, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'teal-dusk-candid',
    name: 'Teal Dusk Candid',
    code: 'TD-187',
    category: 'Night & Urban',
    description: 'Cool blue-teal dusk, quiet candid stillness',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/teal-dusk-candid.jpg'
    referenceImage: 'https://picsum.photos/seed/teal-dusk-candid/600/400',
    prompt:
      'candid dusk photography, cool teal and blue color grade, quiet still contemplative mood, soft ambient artificial light in background, understated urban calm',
    previewTint: '#3A5A64',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: -11.0, tint: 3.6, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'stone-arch-editorial',
    name: 'Stone Arch Editorial',
    code: 'SA-812',
    category: 'Architecture',
    description: 'Monochrome stone backdrop, confident fashion pose',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/stone-arch-editorial.jpg'
    referenceImage: 'https://picsum.photos/seed/stone-arch-editorial/600/400',
    prompt:
      'architectural fashion editorial photography, monochrome stone archway backdrop, confident directional pose, clean neutral color grade, strong graphic symmetry',
    previewTint: '#8A8880',
    previewOpacity: 0.12,
    filter: { grayscale: false, warmth: 8.4, tint: 2.2, saturation: 1.27, contrast: 1.3, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'low-warm-cinematic',
    name: 'Low Warm Cinematic',
    code: 'LW-349',
    category: 'Cinematic',
    description: 'Dim warm light, intimate close crop, film mood',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/low-warm-cinematic.jpg'
    referenceImage: 'https://picsum.photos/seed/low-warm-cinematic/600/400',
    prompt:
      'low-light cinematic portrait, dim warm amber lighting, intimate close crop framing, soft film-like grain, quiet introspective mood',
    previewTint: '#5A422A',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: 14.0, tint: 3.6, saturation: 0.83, contrast: 0.9, grain: 0.16, vignette: 0.28, letterbox: false },
  },
  {
    id: 'retro-americana-diner',
    name: 'Retro Americana Diner',
    code: 'RA-955',
    category: 'Film & Vintage',
    description: 'Faded teal and mustard, vintage roadside charm',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/retro-americana-diner.jpg'
    referenceImage: 'https://picsum.photos/seed/retro-americana-diner/600/400',
    prompt:
      'retro americana photography, faded teal and mustard yellow color palette, vintage roadside diner charm, warm nostalgic midcentury grain, playful saturated tone',
    previewTint: '#C89A3A',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: 11.2, tint: 2.9, saturation: 1.05, contrast: 0.9, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'golden-backlight-silhouette',
    name: 'Golden Backlight Silhouette',
    code: 'GB-127',
    category: 'Portrait',
    description: 'Strong sunburst flare, warm rim light, silhouette',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/golden-backlight-silhouette.jpg'
    referenceImage: 'https://picsum.photos/seed/golden-backlight-silhouette/600/400',
    prompt:
      'strong golden hour backlight portrait, sunburst lens flare, warm rim lighting around subject, soft glowing haze, romantic nostalgic warmth',
    previewTint: '#F0B060',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: 14.0, tint: 3.6, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'golden-field-cowgirl',
    name: 'Golden Field Warmth',
    code: 'GF-368',
    category: 'Lifestyle',
    description: 'Bright warm field light, joyful natural glow',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/golden-field-cowgirl.jpg'
    referenceImage: 'https://picsum.photos/seed/golden-field-cowgirl/600/400',
    prompt:
      'bright warm golden field lifestyle portrait, joyful natural expression, soft glowing backlight, warm honey color grade, relaxed sunny mood',
    previewTint: '#F0C878',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: 11.2, tint: 2.9, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.04, letterbox: false },
  },
  {
    id: 'color-split-editorial',
    name: 'Color Split Editorial',
    code: 'CS-741',
    category: 'Experimental',
    description: 'Diptych color vs mono, graphic beauty editorial',
    // Real photo -- lives in the web app's public/reference-photos folder.
    // Once you deploy the web app, replace this with:
    // 'https://your-app.vercel.app/reference-photos/color-split-editorial.jpg'
    referenceImage: 'https://picsum.photos/seed/color-split-editorial/600/400',
    prompt:
      'graphic beauty editorial diptych, one half rich saturated color and one half fine art black and white, sharp studio lighting, striking symmetrical composition',
    previewTint: '#2A6A5A',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: -8.8, tint: 2.9, saturation: 1.27, contrast: 1.3, grain: 0.03, vignette: 0.1, letterbox: false },
  },
  {
    id: 'soft-realism',
    name: 'Soft Realism',
    code: 'SR-026',
    category: 'Portrait',
    description: 'Barely-there enhancement, natural texture kept',
    referenceImage: 'https://picsum.photos/seed/soft-realism/600/400',
    prompt:
      'soft realism portrait editing, light natural skin smoothing, minimal color correction, true-to-life texture and detail preserved, gentle natural light, understated polish not a heavy filter',
    previewTint: '#F0E8DC',
    previewOpacity: 0.05,
    filter: { grayscale: false, warmth: 3.5, tint: 0.9, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.04, letterbox: false },
  },
  {
    id: 'cinematic-letterbox',
    name: 'Cinematic Letterbox',
    code: 'CL-235',
    category: 'Cinematic',
    description: 'Widescreen black bars, filmic teal-orange grade',
    referenceImage: 'https://picsum.photos/seed/cinematic-letterbox/600/400',
    prompt:
      'cinematic letterboxed film still, widescreen aspect with black bars top and bottom, teal and orange color grading, rich filmic contrast, anamorphic lens character',
    previewTint: '#1E6A6A',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: -8.8, tint: 2.9, saturation: 1.05, contrast: 1.05, grain: 0.16, vignette: 0.1, letterbox: true },
  },
  {
    id: 'raw-authentic',
    name: 'Raw & Authentic',
    code: 'RA-711',
    category: 'Street',
    description: 'Deliberately imperfect, grainy, unposed candid',
    referenceImage: 'https://picsum.photos/seed/raw-authentic/600/400',
    prompt:
      'raw authentic candid photography, deliberately imperfect grain and slight blur, real unposed expression, documentary honesty, anti-polish aesthetic, muted natural color',
    previewTint: '#7A7264',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 7.0, tint: 1.8, saturation: 0.83, contrast: 0.9, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'y2k-flash',
    name: 'Y2K Flash',
    code: 'YK-200',
    category: 'Film & Vintage',
    description: 'Early-2000s camcorder flash, greenish cast',
    referenceImage: 'https://picsum.photos/seed/y2k-flash/600/400',
    prompt:
      'Y2K early 2000s digital camera flash photography, slightly greenish-cyan color cast, harsh direct flash, low-resolution digicam texture, timestamp-era nostalgic snapshot feel',
    previewTint: '#6AAA8A',
    previewOpacity: 0.16,
    filter: { grayscale: false, warmth: -8.8, tint: 2.9, saturation: 1.05, contrast: 1.05, grain: 0.03, vignette: 0.1, letterbox: false },
  },
  {
    id: 'muted-editorial',
    name: 'Muted Editorial',
    code: 'ME-448',
    category: 'Fashion',
    description: 'Desaturated palette, clean and understated',
    referenceImage: 'https://picsum.photos/seed/muted-editorial/600/400',
    prompt:
      'muted editorial fashion photography, desaturated restrained color palette, clean understated composition, soft even light, quiet sophisticated mood',
    previewTint: '#A8A090',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 7.0, tint: 1.8, saturation: 1.05, contrast: 0.9, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'warm-nostalgia',
    name: 'Warm Nostalgia',
    code: 'WN-329',
    category: 'Film & Vintage',
    description: 'Subtle warm vintage tone, gentle not heavy',
    referenceImage: 'https://picsum.photos/seed/warm-nostalgia/600/400',
    prompt:
      'subtle warm nostalgic photo tone, gentle vintage color shift, soft natural warmth, light film character without heavy grain, timeless understated feel',
    previewTint: '#E0B888',
    previewOpacity: 0.1,
    filter: { grayscale: false, warmth: 7.0, tint: 1.8, saturation: 0.83, contrast: 0.9, grain: 0.16, vignette: 0.1, letterbox: false },
  },
  {
    id: 'camcorder-glow',
    name: 'Camcorder Glow',
    code: 'CG-800',
    category: 'Experimental',
    description: 'VHS-era glow, soft blur, retro video texture',
    referenceImage: 'https://picsum.photos/seed/camcorder-glow/600/400',
    prompt:
      'VHS camcorder video still aesthetic, soft glowing highlights, slight chromatic blur, low-fidelity retro video texture, nostalgic analog video color cast',
    previewTint: '#8A6ACA',
    previewOpacity: 0.18,
    filter: { grayscale: false, warmth: -9.9, tint: 3.2, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'quiet-documentary',
    name: 'Quiet Documentary',
    code: 'QD-565',
    category: 'Street',
    description: 'Muted color, candid stillness, real moments',
    referenceImage: 'https://picsum.photos/seed/quiet-documentary/600/400',
    prompt:
      'quiet documentary color photography, muted natural palette, candid still unposed moment, gentle available light, honest understated storytelling mood',
    previewTint: '#8A9484',
    previewOpacity: 0.08,
    filter: { grayscale: false, warmth: 0.8, tint: 1.4, saturation: 0.83, contrast: 0.9, grain: 0.04, vignette: 0.1, letterbox: false },
  },
  {
    id: 'editorial-pop',
    name: 'Editorial Pop',
    code: 'EP-612',
    category: 'Fashion',
    description: 'Punchy contrast, bold color, magazine energy',
    referenceImage: 'https://picsum.photos/seed/editorial-pop/600/400',
    prompt:
      'bold editorial color pop photography, punchy contrast, vivid saturated color story, confident magazine-cover energy, crisp clean light',
    previewTint: '#D4442A',
    previewOpacity: 0.14,
    filter: { grayscale: false, warmth: 9.8, tint: 2.5, saturation: 1.27, contrast: 1.3, grain: 0.03, vignette: 0.04, letterbox: false },
  },
  {
    id: 'anamorphic-cinema',
    name: 'Anamorphic Cinema',
    code: 'AC-235',
    category: 'Cinematic',
    description: 'Cool blue-teal grade, widescreen film bars',
    referenceImage: 'https://picsum.photos/seed/anamorphic-cinema/600/400',
    prompt:
      'anamorphic widescreen cinema still, cool blue-teal color grade, letterboxed black bars, subtle lens flare character, big-budget film atmosphere',
    previewTint: '#1A4A5A',
    previewOpacity: 0.2,
    filter: { grayscale: false, warmth: -11.0, tint: 3.6, saturation: 1.05, contrast: 1.05, grain: 0.16, vignette: 0.1, letterbox: true },
  },
];
