'use client';

import { useState, useRef, useCallback } from 'react';
import { STYLE_PRESETS, STYLE_CATEGORIES } from '@/lib/styles';

type Status = 'idle' | 'ready' | 'processing' | 'done' | 'error';

export default function Home() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0].id);
  const [status, setStatus] = useState<Status>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Resize so the uploaded photo stays well under Vercel's request
        // size limit -- phone photos can be 5-10MB+, which fails silently
        // with a confusing error otherwise.
        const MAX_DIMENSION = 1600;
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
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        setImageDataUrl(resizedDataUrl);
        setStatus('ready');
        setResultUrl(null);
        setErrorMsg(null);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const generate = async () => {
    if (!imageDataUrl) return;
    setStatus('processing');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl, styleId: selectedStyle }),
      });

      // The server (or Vercel's platform, e.g. on a request-too-large error)
      // can sometimes respond with plain text/HTML instead of JSON. Guard
      // against that instead of letting res.json() throw a confusing error.
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

  const currentStyle = STYLE_PRESETS.find((s) => s.id === selectedStyle)!;

  return (
    <main className="min-h-screen px-6 py-10 md:py-16 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-12 md:mb-16">
        <p className="font-mono text-xs tracking-widest2 text-copper uppercase mb-3">
          Roll 001 · Exp. never
        </p>
        <h1 className="font-display italic text-4xl md:text-6xl leading-[1.05] text-cream">
          Any photo,
          <br />
          <span className="text-copper not-italic">someone else&apos;s eye.</span>
        </h1>
        <p className="font-body text-cream/60 mt-4 max-w-md text-sm md:text-base">
          Drop a photo in. Pick a look. Get the shot as if a photographer you admire
          had taken it.
        </p>
      </header>

      {/* Upload / Result frame */}
      <div
        className="negative-frame px-8 py-10 md:px-12 md:py-14 mb-8"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="relative">
          {status === 'done' && resultUrl ? (
            <div className="text-center">
              <img
                src={resultUrl}
                alt={`Result in ${currentStyle.name} style`}
                className="mx-auto max-h-[440px] w-auto rounded-sm shadow-2xl"
              />
              <p className="font-mono text-xs text-copper mt-4 tracking-widest2 uppercase">
                {currentStyle.code} · {currentStyle.name}
              </p>
              <div className="flex gap-3 justify-center mt-5">
                <a
                  href={resultUrl}
                  download
                  className="font-mono text-xs uppercase tracking-widest2 border border-copper text-copper px-5 py-2.5 hover:bg-copper hover:text-charcoal transition-colors"
                >
                  Save Image
                </a>
                <button
                  onClick={() => {
                    setStatus('ready');
                    setResultUrl(null);
                  }}
                  className="font-mono text-xs uppercase tracking-widest2 border border-hairline text-cream/70 px-5 py-2.5 hover:border-cream/40 transition-colors"
                >
                  Try Another Look
                </button>
              </div>
            </div>
          ) : imageDataUrl ? (
            <div className="text-center">
              <img
                src={imageDataUrl}
                alt="Your uploaded photo"
                className="mx-auto max-h-[440px] w-auto rounded-sm opacity-95"
              />
              {status === 'processing' && (
                <p className="font-mono text-xs text-copper mt-5 tracking-widest2 uppercase animate-pulse">
                  Developing in {currentStyle.name}...
                </p>
              )}
              {status === 'error' && (
                <p className="font-mono text-xs text-red-400 mt-5 tracking-widest2 uppercase">
                  {errorMsg}
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-center py-16 group"
            >
              <div className="font-mono text-xs uppercase tracking-widest2 text-cream/40 group-hover:text-copper transition-colors">
                Click or drop a photo here
              </div>
              <div className="font-display italic text-2xl text-cream/70 mt-3 group-hover:text-cream transition-colors">
                Load your negative
              </div>
            </button>
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
        </div>
      </div>

      {/* Style filmstrip, grouped by category */}
      <section className="mb-10">
        {STYLE_CATEGORIES.map((category) => {
          const stylesInCategory = STYLE_PRESETS.filter((s) => s.category === category);
          if (stylesInCategory.length === 0) return null;
          return (
            <div key={category} className="mb-8">
              <p className="font-mono text-xs uppercase tracking-widest2 text-cream/40 mb-4">
                {category}
              </p>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
                {stylesInCategory.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`flex-shrink-0 w-40 text-left border transition-colors ${
                      selectedStyle === style.id
                        ? 'border-copper'
                        : 'border-hairline hover:border-cream/30'
                    }`}
                  >
                    <div className="relative w-full h-24 overflow-hidden bg-surface2">
                      <img
                        src={style.referenceImage}
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="grain-overlay" />
                    </div>
                    <div className="px-3 py-2.5">
                      <p className="font-mono text-[10px] text-copper tracking-widest2 uppercase">
                        {style.code}
                      </p>
                      <p className="font-display text-cream text-sm mt-0.5">{style.name}</p>
                      <p className="font-body text-cream/40 text-xs mt-0.5">
                        {style.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Generate button */}
      {imageDataUrl && status !== 'done' && (
        <button
          onClick={generate}
          disabled={status === 'processing'}
          className="font-mono text-sm uppercase tracking-widest2 bg-copper text-charcoal px-8 py-3.5 hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'processing' ? 'Developing...' : 'Apply Look'}
        </button>
      )}

      <footer className="mt-20 font-mono text-[10px] text-cream/25 tracking-widest2 uppercase">
        Styles are references, not the photographers themselves · Build your own roll in lib/styles.ts
      </footer>
    </main>
  );
}
