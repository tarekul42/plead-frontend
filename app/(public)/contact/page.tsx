"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/5">
            <MessageSquare className="h-7 w-7 text-brand" />
          </div>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Get in Touch</h1>
          <p className="text-muted">
            Have a question or feedback? We would love to hear from you.
          </p>
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
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Name</label>
                <Input required placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <Input type="email" required placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Subject</label>
              <Input required placeholder="How can we help?" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Message</label>
              <Textarea required rows={5} placeholder="Tell us more about your inquiry..." />
            </div>
            <Button type="submit" className="w-full" leftIcon={<Send className="h-4 w-4" />}>
              Send Message
            </Button>
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
