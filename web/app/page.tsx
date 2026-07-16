'use client';

import { useState, useRef, useCallback } from 'react';
import { STYLE_PRESETS, STYLE_CATEGORIES } from '@/lib/styles';

type Status = 'idle' | 'ready' | 'processing' | 'done' | 'error';

export default function Home() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(STYLE_CATEGORIES[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Resize so the uploaded photo stays well under the server's
        // request size limit -- phone/camera photos are often 5-10MB+.
        const MAX_DIMENSION = 1536;
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

        setImageDataUrl(resizedDataUrl);
        setStatus('ready');
        setResultUrl(null);
        setErrorMsg(null);
        setSelectedStyle(null);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const applyStyle = async (styleId: string) => {
    setSelectedStyle(styleId);
    if (!imageDataUrl) return; // just remember the selection until a photo exists

    setStatus('processing');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl, styleId }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(
          res.status === 413
            ? 'That photo was too large to upload. Try a different photo.'
            : `Unexpected server response (${res.status}): ${text.slice(0, 120)}`
        );
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResultUrl(data.resultUrl);
      setStatus('done');
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const currentStyle = STYLE_PRESETS.find((s) => s.id === selectedStyle);
  const stylesInCategory = STYLE_PRESETS.filter((s) => s.category === activeCategory);
  const displayImage = resultUrl || imageDataUrl;

  return (
    <main className="min-h-screen px-5 py-8 md:py-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-8 md:mb-10">
        <p className="font-mono text-xs tracking-widest2 text-copper uppercase mb-2">
          Darkroom
        </p>
        <h1 className="font-display text-3xl md:text-5xl leading-tight text-cream">
          Any photo, <span className="text-copper italic">expert-edited.</span>
        </h1>
        <p className="font-body text-cream/55 mt-3 max-w-lg text-sm md:text-base">
          Upload a photo, tap a style, get a real AI-edited version back in seconds.
        </p>
      </header>

      <div className="grid md:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Photo panel */}
        <div className="rounded-3xl bg-surface border border-hairline p-4 md:p-6">
          <div className="relative rounded-2xl overflow-hidden bg-surface2 min-h-[320px] flex items-center justify-center">
            {displayImage ? (
              <>
                <img
                  src={displayImage}
                  alt={resultUrl ? `Photo styled as ${currentStyle?.name}` : 'Your photo'}
                  className="w-full max-h-[560px] object-contain"
                />
                {status === 'processing' && (
                  <div className="absolute inset-0 bg-charcoal/70 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-2 border-copper border-t-transparent rounded-full animate-spin" />
                    <p className="font-mono text-xs text-copper tracking-widest2 uppercase">
                      Editing in {currentStyle?.name}...
                    </p>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="w-full h-full py-24 text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-copper/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-copper/25 transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-copper">
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="font-display text-xl text-cream/80 group-hover:text-cream transition-colors">
                  Add a photo to get started
                </p>
                <p className="font-body text-cream/40 text-sm mt-1">
                  Click here or drop an image
                </p>
              </button>
            )}
          </div>

          {errorMsg && (
            <p className="font-body text-sm text-red-400 mt-4 rounded-xl bg-red-400/10 px-4 py-3">
              {errorMsg}
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {imageDataUrl && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="font-body text-sm text-cream/45 hover:text-cream/80 transition-colors mt-4"
            >
              Choose a different photo
            </button>
          )}
        </div>

        {/* Side panel: download + style picker */}
        <div className="rounded-3xl bg-surface border border-hairline p-4 md:p-5 md:sticky md:top-8">
          {resultUrl && status === 'done' && (
            <div className="mb-5 pb-5 border-b border-hairline">
              <p className="font-mono text-[10px] text-copper tracking-widest2 uppercase mb-3">
                {currentStyle?.code} · {currentStyle?.name}
              </p>
              <a
                href={resultUrl}
                download={`darkroom-${currentStyle?.id}.png`}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-copper text-charcoal font-body text-sm font-semibold py-3 hover:bg-cream transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 3v13m0 0l-5-5m5 5l5-5M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download photo
              </a>
            </div>
          )}

          <p className="font-mono text-[10px] uppercase tracking-widest2 text-cream/40 mb-3">
            {imageDataUrl ? 'Tap a style to apply it' : 'Styles'}
          </p>

          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-3 mb-1 -mx-1 px-1">
            {STYLE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 rounded-full px-3 py-1.5 font-body text-xs whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-copper text-charcoal font-medium'
                    : 'bg-surface2 text-cream/50 hover:text-cream/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Style grid */}
          <div className="grid grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-1">
            {stylesInCategory.map((style) => (
              <button
                key={style.id}
                onClick={() => applyStyle(style.id)}
                disabled={status === 'processing'}
                className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all disabled:opacity-50 ${
                  selectedStyle === style.id
                    ? 'border-copper scale-[0.97]'
                    : 'border-transparent hover:border-copper/40'
                }`}
                title={style.name}
              >
                <img
                  src={style.referenceImage}
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/90 to-transparent text-cream text-[10px] font-body px-1.5 py-1.5 leading-tight text-left">
                  {style.name}
                </span>
              </button>
            ))}
          </div>

          {!imageDataUrl && (
            <p className="font-body text-xs text-cream/40 mt-4 rounded-xl bg-surface2 px-3 py-3">
              Add a photo on the left first — then tapping a style edits it right away.
            </p>
          )}
        </div>
      </div>

      <footer className="mt-14 font-mono text-[10px] text-cream/25 tracking-widest2 uppercase">
        78 styles across 13 categories · Real AI photo editing, powered by Gemini
      </footer>
    </main>
  );
}
