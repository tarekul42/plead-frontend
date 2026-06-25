"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <MessageSquare className="mx-auto mb-4 h-10 w-10 text-[#2563EB]" />
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Get in Touch</h1>
          <p className="text-muted">
            Have a question or feedback? We would love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-card border border-[#10B981]/20 bg-[#10B981]/5 p-8 text-center">
            <Send className="mx-auto mb-4 h-8 w-8 text-[#10B981]" />
            <h2 className="mb-2 text-xl font-semibold">Message Sent!</h2>
            <p className="text-muted">
              Thanks for reaching out. We will get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Name</label>
                <input
                  required
                  placeholder="Your name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Subject</label>
              <input
                required
                placeholder="How can we help?"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us more about your inquiry..."
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] resize-y"
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>
        )}

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted">
          <Mail className="h-4 w-4" />
          <span>hello@proplead.ai</span>
        </div>
      </div>
    </div>
  );
}
