import Link from "next/link";

export default function LandingPage() {
  return (
    <div>
      <section className="mx-auto max-w-container px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
          AI-Powered Real Estate
          <br />
          <span className="text-[#2563EB]">Lead Engine</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted">
          Match leads to properties, generate marketing copy, and close deals faster.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-lg bg-[#2563EB] px-8 py-3 text-white transition hover:opacity-90"
          >
            Start free
          </Link>
          <Link
            href="/properties"
            className="rounded-lg border border-border px-8 py-3 transition hover:bg-neutral-100 dark:hover:bg-surface"
          >
            Explore properties
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            Everything you need to close deals
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-card border border-border p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "AI Lead Matcher",
    description: "Automatically match leads to the best properties with AI-powered scoring.",
  },
  {
    title: "AI Copywriter",
    description: "Generate compelling property descriptions and outreach emails in seconds.",
  },
  {
    title: "Lead Pipeline",
    description: "Track leads through every stage of the sales pipeline.",
  },
  {
    title: "Property Inventory",
    description: "Manage your entire property catalog with ease.",
  },
  {
    title: "Analytics",
    description: "Get insights into your team's performance and AI usage.",
  },
  {
    title: "Multi-tenant",
    description: "Works for agencies of any size with full data isolation.",
  },
];
