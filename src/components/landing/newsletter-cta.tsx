"use client";

import { Check, Loader2, Mail } from "lucide-react";
import { useState } from "react";

import { SectionHeader } from "@/components/landing/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscribeNewsletter } from "@/lib/queries/use-public";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const subscribe = useSubscribeNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await subscribe.mutateAsync({ email });
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return (
    <section className="section-padding bg-section-alt">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-grid">
          <div className="bg-gradient-hero pointer-events-none absolute inset-0" />
          <div className="relative px-6 py-20 text-center sm:px-12 md:py-28">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <SectionHeader
              eyebrow="Newsletter"
              title="Stay ahead of the market"
              subtitle="Weekly insights, AI tips, and industry trends — delivered every Thursday."
              className="mb-8"
            />
            {submitted ? (
              <div className="flex items-center justify-center gap-2 text-brand">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                  <Check className="h-5 w-5" />
                </div>
                <span className="font-medium">Thanks for subscribing!</span>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                    {error && <p className="mt-1.5 text-left text-xs text-danger">{error}</p>}
                  </div>
                  <Button type="submit" disabled={subscribe.isPending}>
                    {subscribe.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </form>
                <p className="mt-4 text-xs text-muted">
                  Join 2,000+ subscribers. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
