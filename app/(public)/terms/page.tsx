export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Terms of Service</h1>
      <p className="mb-8 text-sm text-muted">Last updated: June 2026</p>

      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using PropLead AI, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">2. Description of Service</h2>
          <p>PropLead AI provides AI-powered real estate lead management, property matching, and marketing copy generation tools. The service is offered on a free-tier basis with no guarantee of uptime or availability.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">3. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials, ensuring the accuracy of data you enter, and using the AI features in compliance with applicable real estate regulations. You agree not to use the service for any unlawful purpose.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">4. AI Feature Disclaimer</h2>
          <p>AI-generated content (match scores, property descriptions, and outreach emails) is provided as a tool to assist agents. It should not be relied upon as the sole basis for business decisions. Always verify AI-generated content before use. We do not guarantee the accuracy, completeness, or suitability of AI outputs.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">5. Limitation of Liability</h2>
          <p>PropLead AI is provided &ldquo;as is&rdquo; without warranty of any kind. We are not liable for any damages arising from the use or inability to use the service. In no event shall our liability exceed the amount paid by you for the service (which is $0 for free-tier users).</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">6. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms or engage in abusive behavior. You may terminate your account at any time from your dashboard.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">7. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. We will notify users of material changes via email or in-app notification.</p>
        </section>
      </div>
    </div>
  );
}
