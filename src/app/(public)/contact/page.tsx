"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContact } from "@/lib/queries/use-public";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitContact = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await submitContact.mutateAsync({ name, email, subject, message });
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/5">
            <MessageSquare className="h-7 w-7 text-brand" />
          </div>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Get in Touch</h1>
          <p className="text-muted">Have a question or feedback? We would love to hear from you.</p>
        </div>

        {submitted ? (
          <div className="rounded-card border border-success/20 bg-success/5 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <Check className="h-6 w-6 text-success" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Message Sent!</h2>
            <p className="text-muted">
              Thanks for reaching out. We will get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-card border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
                {error}
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Name</label>
                <Input
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Subject</label>
              <Input
                required
                placeholder="How can we help?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Message</label>
              <Textarea
                required
                rows={5}
                placeholder="Tell us more about your inquiry..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              leftIcon={
                submitContact.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )
              }
              disabled={submitContact.isPending}
            >
              {submitContact.isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted">
          <Mail className="h-4 w-4" />
          <a href="mailto:hello@proplead.ai" className="hover:text-foreground">
            hello@proplead.ai
          </a>
        </div>
      </div>
    </div>
  );
}
