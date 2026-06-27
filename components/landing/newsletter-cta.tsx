"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h2 className="mb-3 text-3xl font-bold md:text-4xl">Stay Updated</h2>
        <p className="mb-10 text-muted text-lg leading-relaxed">
          Get the latest tips, product updates, and industry insights delivered to your inbox.
        </p>
        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-success">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <Check className="h-5 w-5" />
            </div>
            <span className="font-medium text-lg">Thanks for subscribing!</span>
          </div>
        ) : (
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
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
