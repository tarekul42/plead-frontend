"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/5">
          <Mail className="h-6 w-6 text-brand" />
        </div>
        <h2 className="mb-2 text-2xl font-bold md:text-3xl">Stay Updated</h2>
        <p className="mb-8 text-muted">
          Get the latest tips, product updates, and industry insights delivered to your inbox.
        </p>
        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-success">
            <Check className="h-5 w-5" />
            <span className="font-medium">Thanks for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand"
            />
            <button
              type="submit"
              className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
