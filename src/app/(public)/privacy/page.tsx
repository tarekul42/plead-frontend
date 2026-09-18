export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 md:grid-cols-[200px_1fr]">
        {/* Table of Contents */}
        <nav className="hidden md:block">
          <div className="sticky top-24">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              On this page
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { id: "collect", label: "1. Information We Collect" },
                { id: "use", label: "2. How We Use Your Information" },
                { id: "storage", label: "3. Data Storage & Security" },
                { id: "retention", label: "4. Data Retention" },
                { id: "third-party", label: "5. Third-Party Services" },
                { id: "rights", label: "6. Your Rights" },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-muted transition hover:text-brand"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Content */}
        <div>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Privacy Policy</h1>
          <p className="mb-8 text-sm text-muted">Last updated: June 2026</p>

          <div className="space-y-8 text-sm text-muted leading-relaxed">
            <section id="collect">
              <h2 className="mb-3 text-lg font-semibold text-foreground">1. Information We Collect</h2>
              <p>
                We collect information you provide when creating an account, adding properties, managing
                leads, and using our AI features. This includes your name, email address, phone number,
                and real estate listing data.
              </p>
            </section>

            <section id="use">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                2. How We Use Your Information
              </h2>
              <p>
                Your data is used exclusively to provide and improve the PropLead service. We use AI
                providers (Google Gemini, Groq) to process match requests and generate marketing copy.
                These providers receive only the data necessary to fulfill your request and do not train
                on your data.
              </p>
            </section>

            <section id="storage">
              <h2 className="mb-3 text-lg font-semibold text-foreground">3. Data Storage & Security</h2>
              <p>
                All data is stored on MongoDB Atlas (AWS/GCP infrastructure) with encryption at rest and
                in transit. We implement industry-standard security measures including access controls,
                audit logging, and regular security assessments.
              </p>
            </section>

            <section id="retention">
              <h2 className="mb-3 text-lg font-semibold text-foreground">4. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active. You may request deletion of
                your account and associated data at any time by contacting us. Data will be permanently
                deleted within 30 days of your request.
              </p>
            </section>

            <section id="third-party">
              <h2 className="mb-3 text-lg font-semibold text-foreground">5. Third-Party Services</h2>
              <p>
                We use Clerk for authentication, Cloudinary for image storage, Google Gemini and Groq
                for AI processing, and Sentry for error monitoring. Each service has its own privacy
                policy governing how they handle data. We do not sell or share your data with
                advertisers or other third parties.
              </p>
            </section>

            <section id="rights">
              <h2 className="mb-3 text-lg font-semibold text-foreground">6. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal data. You can export your
                data at any time from your dashboard. Contact us to exercise these rights or if you have
                questions about this policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
