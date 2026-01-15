"use client";

import { useMemo, useState } from "react";

type PaletteColor = { hex: string; rgb: [number, number, number] };
type AnalysisResult = {
  palette: PaletteColor[];
  vibe_words: string[];
  caption: string;
  interior: { style: string; keywords: string[] };
  meta?: { latency_ms?: number };
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filename = useMemo(() => file?.name ?? "", [file]);

  function onSelectFile(f: File | null) {
    setFile(f);
    setResult(null);
    setError(null);

    if (!f) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  }

  async function onAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/analyze", { method: "POST", body: form });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = (await res.json()) as AnalysisResult;
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            VibeLens <span className="opacity-80"></span>
          </h1>
          <p className="mt-2 text-zinc-300">
            Turn a photo into an entire vibe.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upload card - insert for attaching photo + button to begin analysis */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm">
            <h2 className="text-lg font-medium">Upload a photo</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Sunset, ocean, city lights — anything with a mood.
            </p>
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-50 hover:file:bg-zinc-700"
                onChange={(e) => onSelectFile(e.target.files?.[0] ?? null)}
              />

              {filename ? (
                <div className="mt-3 text-xs text-zinc-400">
                  Selected: <span className="text-zinc-200">{filename}</span>
                </div>
              ) : null}
            </div>

            {previewUrl ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-64 w-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-4 grid h-64 place-items-center rounded-xl border border-dashed border-zinc-800 text-zinc-500">
                waiting on your image...
              </div>
            )}

            <button
              onClick={onAnalyze}
              disabled={!file || loading}
              className="mt-4 w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            {error ? (
              <p className="mt-3 text-sm text-red-300">{error}</p>
            ) : null}
          </section>

          {/* Results */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm">
            <h2 className="text-lg font-medium">Results</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Palette, vibe words, caption, interior mood.
            </p>

            {!result ? (
              <div className="mt-4 rounded-xl border border-dashed border-zinc-800 p-6 text-zinc-500">
                Run an analysis to see results.
              </div>
            ) : (
              <div className="mt-4 space-y-5">
                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    Palette
                  </div>
                  <div className="mt-2 grid grid-cols-6 gap-2">
                    {result.palette.map((c) => (
                      <button
                        key={c.hex}
                        title={`Copy ${c.hex}`}
                        onClick={() => navigator.clipboard.writeText(c.hex)}
                        className="h-10 rounded-lg border border-zinc-800"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    Vibe words
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.vibe_words.map((w) => (
                      <span
                        key={w}
                        className="rounded-full bg-zinc-950/40 px-3 py-1 text-sm text-zinc-200 border border-zinc-800"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    Caption
                  </div>
                  <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-zinc-200">
                    {result.caption}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    Interior vibe
                  </div>
                  <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
                    <div className="text-zinc-100">{result.interior.style}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.interior.keywords.map((k) => (
                        <span
                          key={k}
                          className="rounded-full border border-zinc-800 px-2 py-1 text-xs text-zinc-300"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-zinc-500">
                  {result.meta?.latency_ms
                    ? `Latency: ${result.meta.latency_ms}ms`
                    : null}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
