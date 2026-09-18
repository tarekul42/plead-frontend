"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bath, Bed, CheckCircle2, MapPin, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const demoSlides = [
  {
    type: "property" as const,
    title: "Modern 3BR in Brooklyn",
    location: "Brooklyn, NY",
    price: "$850,000",
    beds: 3,
    baths: 2,
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    type: "match" as const,
    lead: "Sarah J.",
    budget: "$850K",
    property: "Modern 3BR in Brooklyn",
    score: 92,
    reason: "Matches budget, location preference, and bedroom count",
  },
  {
    type: "email" as const,
    lead: "Sarah J.",
    subject: "Your dream home in Brooklyn is available",
    preview:
      "Hi Sarah, I found a stunning 3-bedroom apartment in Brooklyn that matches your criteria perfectly...",
  },
];

function PropertySlide({ slide }: { slide: (typeof demoSlides)[0] }) {
  return (
    <div className="space-y-3">
      <div className="h-32 rounded-xl sm:h-40" style={{ background: slide.image }} />
      <div className="rounded-xl border border-border bg-background/80 p-3 backdrop-blur-sm">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-semibold">{slide.title}</p>
          <p className="text-sm font-bold text-brand">{slide.price}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {slide.location}
          </span>
          <span className="flex items-center gap-1">
            <Bed className="h-3 w-3" /> {slide.beds}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3 w-3" /> {slide.baths}
          </span>
        </div>
      </div>
    </div>
  );
}

function MatchSlide({ slide }: { slide: (typeof demoSlides)[1] }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-background/80 p-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Lead</p>
            <p className="text-sm font-semibold">{slide.lead}</p>
          </div>
          <Badge variant="success">{slide.score}% match</Badge>
        </div>
        <div className="rounded-lg bg-success/5 p-3">
          <p className="mb-1 text-xs font-medium text-success">Why this match?</p>
          <p className="text-xs text-muted">{slide.reason}</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-background/80 p-3 backdrop-blur-sm">
        <p className="mb-1 text-xs text-muted">Matched Property</p>
        <p className="text-sm font-medium">{slide.property}</p>
        <p className="text-xs text-muted">Budget: {slide.budget}</p>
      </div>
    </div>
  );
}

function EmailSlide({ slide }: { slide: (typeof demoSlides)[2] }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-background/80 p-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
            PL
          </div>
          <div>
            <p className="text-xs text-muted">AI-Generated Outreach</p>
            <p className="text-sm font-medium">To: {slide.lead}</p>
          </div>
        </div>
        <p className="mb-2 text-xs font-medium">{slide.subject}</p>
        <p className="text-xs leading-relaxed text-muted">{slide.preview}</p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
            Professional
          </span>
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            Personalized
          </span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="bg-gradient-hero pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-container px-4 pb-20 pt-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm font-medium text-brand">
                <Sparkles className="h-4 w-4" />
                AI-Powered Real Estate
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-balance text-4xl font-bold leading-tight md:text-5xl"
            >
              Close more deals with{" "}
              <span className="text-gradient-brand">AI-powered lead matching</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 max-w-lg text-lg leading-relaxed text-muted"
            >
              Match the right lead to the right property in seconds. Automate outreach, generate
              marketing copy, and track your pipeline — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/sign-up">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Start free
                </Button>
              </Link>
              <Link href="/properties">
                <Button variant="secondary" size="lg">
                  Explore properties
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" /> No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" /> Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" /> Cancel anytime
              </span>
            </motion.div>
          </div>

          {/* Right: Animated Product Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="glass relative overflow-hidden rounded-2xl shadow-xl">
              {/* Slide indicator tabs */}
              <div className="flex border-b border-border bg-surface/50 px-4 pt-3 backdrop-blur-sm">
                {["Property", "AI Match", "Outreach"].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => setCurrentSlide(i)}
                    className={`relative mr-4 pb-3 text-xs font-medium transition ${
                      currentSlide === i ? "text-brand" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {label}
                    {currentSlide === i && (
                      <motion.div
                        layoutId="hero-tab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Slide content */}
              <div className="p-4 sm:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentSlide === 0 && <PropertySlide slide={demoSlides[0]} />}
                    {currentSlide === 1 && <MatchSlide slide={demoSlides[1]} />}
                    {currentSlide === 2 && <EmailSlide slide={demoSlides[2]} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Close button decoration */}
              <button
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-muted transition hover:bg-neutral-200 dark:hover:bg-neutral-300"
                aria-label="Close demo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Decorative glow */}
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-success/10 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
