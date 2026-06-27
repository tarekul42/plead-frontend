"use client";

import { useState } from "react";
import { aiApi } from "@/lib/api-client";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

interface AiCopyGeneratorProps {
  propertyId: string;
}

const TONES = ["professional", "luxury", "friendly", "modern"];

export function AiCopyGenerator({ propertyId }: AiCopyGeneratorProps) {
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    title: string;
    description: string;
    highlights: string[];
    provider: string;
    tokensUsed: number;
    cached: boolean;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await aiApi.generatePropertyDescription({ propertyId, tone });
      if (res.success) {
        setResult(res.data);
      } else {
        setError("Failed to generate copy");
      }
    } catch {
      setError("Service unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold">AI Copy Generator</h3>

      <div className="mb-3">
        <label htmlFor="tone" className="text-xs text-muted">Tone</label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {TONES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
        ) : (
          <><Sparkles className="h-4 w-4" /> Generate</>
        )}
      </button>

      {loading && (
        <p className="mt-2 text-center text-xs text-muted">Creating your description...</p>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-danger/5 p-3 text-xs text-danger">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {result && (
        <div className="mt-3 space-y-2">
          <h4 className="font-medium">{result.title}</h4>
          <p className="text-sm text-muted">{result.description}</p>
          {result.highlights.length > 0 && (
            <ul className="space-y-1">
              {result.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-success" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
