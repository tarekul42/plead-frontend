"use client";

import { useState } from "react";
import { Sparkles, FileText, Mail, Loader2, Check } from "lucide-react";

type ToolType = "match" | "description" | "email";

export default function AiToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolType>("match");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setDone(false);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 2000);
  };

  const tools = [
    { id: "match" as ToolType, icon: Sparkles, title: "Lead-Property Match", desc: "Score a lead against your property inventory" },
    { id: "description" as ToolType, icon: FileText, title: "Property Description", desc: "Generate AI marketing copy for listings" },
    { id: "email" as ToolType, icon: Mail, title: "Outreach Email", desc: "Generate personalized lead outreach emails" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">AI Tools</h1>

      <div className="mb-6 flex gap-2 rounded-lg border border-border bg-surface p-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => { setActiveTool(tool.id); setDone(false); }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm transition ${
              activeTool === tool.id
                ? "bg-[#2563EB] text-white shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <tool.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tool.title}</span>
          </button>
        ))}
      </div>

      <div className="rounded-card border border-border bg-surface p-8 shadow-sm">
        {activeTool === "match" && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Lead-Property Match Engine</h2>
            <p className="mb-6 text-sm text-muted">Select a lead and optionally filter properties to find the best matches.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Lead</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]">
                  <option>Select a lead...</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Properties (optional)</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]">
                  <option>All properties</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 flex items-center gap-2 rounded-lg bg-[#10B981] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Analyzing..." : done ? "Match Again" : "Run Match"}
            </button>
          </div>
        )}

        {activeTool === "description" && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Property Description Generator</h2>
            <p className="mb-6 text-sm text-muted">Generate compelling marketing descriptions for your property listings.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Property</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]">
                  <option>Select a property...</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Tone</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]">
                  <option>Luxury</option>
                  <option>Family-friendly</option>
                  <option>Investment-focused</option>
                  <option>Casual</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 flex items-center gap-2 rounded-lg bg-[#10B981] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Generating..." : done ? "Generate Again" : "Generate Description"}
            </button>
          </div>
        )}

        {activeTool === "email" && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Outreach Email Generator</h2>
            <p className="mb-6 text-sm text-muted">Generate personalized outreach emails for your leads.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Lead</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]">
                  <option>Select a lead...</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Property</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]">
                  <option>Select a property...</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium">Tone</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]">
                <option>Professional</option>
                <option>Friendly</option>
                <option>Urgent</option>
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 flex items-center gap-2 rounded-lg bg-[#10B981] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Generating..." : done ? "Generate Again" : "Generate Email"}
            </button>
          </div>
        )}

        {done && (
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-[#10B981]/5 p-4 text-sm text-[#10B981]">
            <Check className="h-4 w-4" />
            <span>Generation complete! Check the results below.</span>
          </div>
        )}
      </div>
    </div>
  );
}
