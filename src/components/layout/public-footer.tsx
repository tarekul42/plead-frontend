import NextLink from "next/link";
import { Globe, ExternalLink, LinkIcon, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Explore", href: "/properties" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "AI Features", href: "/#ai-features" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "Help", href: "/help" },
  ],
};

const socialLinks = [
  { icon: Globe, href: "https://github.com", label: "GitHub" },
  { icon: ExternalLink, href: "https://twitter.com", label: "Twitter" },
  { icon: LinkIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@proplead.ai", label: "Email" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <NextLink href="/" className="text-xl font-bold tracking-tight">
              PropLead
            </NextLink>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              AI-powered real estate lead engine. Match the right lead to the right property
              in seconds — not hours.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => (
                <NextLink
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:border-brand/30 hover:text-brand"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </NextLink>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <NextLink
                      href={link.href}
                      className="text-sm text-muted transition hover:text-foreground"
                    >
                      {link.label}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} PropLead AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
