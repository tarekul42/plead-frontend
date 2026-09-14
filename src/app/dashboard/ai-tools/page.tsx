"use client";

import { useState } from "react";
import { Sparkles, FileText, Mail, Loader2, Check } from "lucide-react";
import { useLeads } from "@/lib/queries/use-leads";
import { useProperties } from "@/lib/queries/use-properties";
import { useMatchLeadProperties, useGeneratePropertyDescription, useGenerateOutreachEmail } from "@/lib/queries/use-ai-tools";
import type { AiMatchResult } from "@/types";

type ToolType = "match" | "description" | "email";

export default function AiToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolType>("match");

  const { data: leadsData } = useLeads();
  const { data: propertiesData } = useProperties({ limit: 100 });

  const leads = leadsData?.data || [];
  const properties = propertiesData?.data || [];

  const matchMutation = useMatchLeadProperties();
  const descriptionMutation = useGeneratePropertyDescription();
  const emailMutation = useGenerateOutreachEmail();

  const [matchLeadId, setMatchLeadId] = useState("");
  const [descPropertyId, setDescPropertyId] = useState("");
  const [descTone, setDescTone] = useState("standard");
  const [emailLeadId, setEmailLeadId] = useState("");
  const [emailPropertyId, setEmailPropertyId] = useState("");
  const [emailTone, setEmailTone] = useState("professional");

  const matchResult = matchMutation.data;
  const descResult = descriptionMutation.data;
  const emailResult = emailMutation.data;

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
            onClick={() => { setActiveTool(tool.id); }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm transition ${
              activeTool === tool.id
                ? "bg-brand text-white shadow-sm"
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
                <select
                  value={matchLeadId}
                  onChange={(e) => setMatchLeadId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  <option value="">Select a lead...</option>
                  {leads.map((lead: any) => (
                    <option key={lead._id} value={lead._id}>{lead.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => matchLeadId && matchMutation.mutate({ leadId: matchLeadId })}
              disabled={matchMutation.isPending || !matchLeadId}
              className="mt-6 flex items-center gap-2 rounded-lg bg-success px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {matchMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {matchMutation.isPending ? "Analyzing..." : matchResult ? "Match Again" : "Run Match"}
            </button>
            {matchMutation.isError && (
              <p className="mt-4 text-sm text-danger">{matchMutation.error?.message}</p>
            )}
            {matchResult && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-success flex items-center gap-2"><Check className="h-4 w-4" /> Match Results</h3>
                {matchResult.matches.length === 0 ? (
                  <p className="text-sm text-muted">No matches found.</p>
                ) : (
                  matchResult.matches.map((m: AiMatchResult, i: number) => (
                    <div key={i} className="rounded-lg border border-border bg-background/50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{m.propertyTitle}</p>
                        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                          {Math.round(m.score * 100)}% match
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">{m.propertyLocation}</p>
                      <ul className="mt-2 space-y-1">
                        {m.reasons.map((r, j) => (
                          <li key={j} className="text-xs text-muted">• {r}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTool === "description" && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Property Description Generator</h2>
            <p className="mb-6 text-sm text-muted">Generate compelling marketing descriptions for your property listings.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Property</label>
                <select
                  value={descPropertyId}
                  onChange={(e) => setDescPropertyId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  <option value="">Select a property...</option>
                  {properties.map((p: any) => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Tone</label>
                <select
                  value={descTone}
                  onChange={(e) => setDescTone(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  <option value="luxury">Luxury</option>
                  <option value="standard">Standard</option>
                  <option value="brief">Brief</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => descPropertyId && descriptionMutation.mutate({ propertyId: descPropertyId, tone: descTone })}
              disabled={descriptionMutation.isPending || !descPropertyId}
              className="mt-6 flex items-center gap-2 rounded-lg bg-success px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {descriptionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {descriptionMutation.isPending ? "Generating..." : descResult ? "Generate Again" : "Generate Description"}
            </button>
            {descriptionMutation.isError && (
              <p className="mt-4 text-sm text-danger">{descriptionMutation.error?.message}</p>
            )}
            {descResult && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-success flex items-center gap-2"><Check className="h-4 w-4" /> Generated Description</h3>
                <div className="rounded-lg border border-border bg-background/50 p-4">
                  <p className="font-medium">{descResult.title}</p>
                  <p className="mt-2 text-sm text-muted">{descResult.description}</p>
                  {descResult.highlights.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted mb-1">Highlights:</p>
                      <ul className="space-y-1">
                        {descResult.highlights.map((h: string, i: number) => (
                          <li key={i} className="text-xs text-muted">• {h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="mt-3 text-xs text-muted">
                    Provided by {descResult.provider} | {descResult.tokensUsed} tokens
                    {descResult.cached ? " (cached)" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTool === "email" && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Outreach Email Generator</h2>
            <p className="mb-6 text-sm text-muted">Generate personalized outreach emails for your leads.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Lead</label>
                <select
                  value={emailLeadId}
                  onChange={(e) => setEmailLeadId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  <option value="">Select a lead...</option>
                  {leads.map((lead: any) => (
                    <option key={lead._id} value={lead._id}>{lead.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Property</label>
                <select
                  value={emailPropertyId}
                  onChange={(e) => setEmailPropertyId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  <option value="">Select a property...</option>
                  {properties.map((p: any) => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Tone</label>
                <select
                  value={emailTone}
                  onChange={(e) => setEmailTone(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => emailLeadId && emailPropertyId && emailMutation.mutate({ leadId: emailLeadId, propertyId: emailPropertyId, tone: emailTone })}
              disabled={emailMutation.isPending || !emailLeadId || !emailPropertyId}
              className="mt-6 flex items-center gap-2 rounded-lg bg-success px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {emailMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {emailMutation.isPending ? "Generating..." : emailResult ? "Generate Again" : "Generate Email"}
            </button>
            {emailMutation.isError && (
              <p className="mt-4 text-sm text-danger">{emailMutation.error?.message}</p>
            )}
            {emailResult && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-success flex items-center gap-2"><Check className="h-4 w-4" /> Generated Email</h3>
                <div className="rounded-lg border border-border bg-background/50 p-4">
                  <p className="text-sm font-medium">Subject: {emailResult.subject}</p>
                  <div className="mt-2 whitespace-pre-wrap text-sm text-muted">{emailResult.body}</div>
                  <p className="mt-3 text-xs text-muted">
                    Provided by {emailResult.provider} | {emailResult.tokensUsed} tokens
                    {emailResult.cached ? " (cached)" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
