import { Target, Users, Lightbulb, Shield } from "lucide-react";

const values = [
  { icon: Target, title: "Our Mission", text: "Empower real estate agents with AI tools that automate lead matching, so they can focus on closing deals — not data entry." },
  { icon: Users, title: "Built for Teams", text: "Whether you're a solo agent or a 50-person agency, PropLead scales with you. Multi-tenant by design, simple by choice." },
  { icon: Lightbulb, title: "AI-First", text: "We believe AI should be a practical daily tool, not a gimmick. Every feature is designed to save real time and deliver measurable results." },
  { icon: Shield, title: "Privacy First", text: "Your data belongs to you. We never train on your data, never share it, and never lock you in. Export anytime." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">About PropLead AI</h1>
        <p className="text-lg text-muted leading-relaxed">
          PropLead AI is the first completely free AI-powered lead engine purpose-built for real estate agents.
          We combine modern CRM capabilities with cutting-edge AI to help agents match leads to properties,
          generate marketing copy, and close deals faster — all at zero cost.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {values.map((v) => (
          <div key={v.title} className="rounded-card border border-border bg-surface p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/5">
              <v.icon className="h-6 w-6 text-brand" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">{v.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
