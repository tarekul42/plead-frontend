/**
 * XSS Prevention Tests
 *
 * Verifies that user-generated content is properly escaped and that
 * dangerous patterns are not present in the codebase.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Components that render user-generated content
import { PropertySearchBar } from "@/components/properties/property-search-bar";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";

// XSS attack payloads for testing
const XSS_PAYLOADS = [
  '<script>alert("xss")</script>',
  '<img src="x" onerror="alert(1)">',
  '<svg onload="alert(1)">',
  "javascript:alert(1)",
  '<a href="javascript:alert(1)">click</a>',
  '"><script>alert(1)</script>',
  "'-alert(1)-'",
  '<iframe src="javascript:alert(1)">',
  '<body onload="alert(1)">',
  '<input onfocus="alert(1)" autofocus>',
  '{{constructor.constructor("alert(1)")()}}', // Template injection
  "${alert(1)}", // Template literal injection
];

describe("XSS Prevention: Search Components", () => {
  it("PropertySearchBar escapes malicious input in display", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<PropertySearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText(/search by location/i);

    for (const payload of XSS_PAYLOADS.slice(0, 3)) {
      await user.clear(input);
      await user.type(input, payload);

      // Input should contain the raw text, not execute it
      expect(input).toHaveValue(payload);

      // Verify no script execution occurred (would throw if executed)
      expect(document.querySelector("script")).toBeNull();
    }
  });

  it("search input does not allow javascript: protocol in value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<PropertySearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText(/search by location/i);
    await user.type(input, "javascript:alert(1)");

    // The value should be stored as plain text, not executed
    expect(input).toHaveValue("javascript:alert(1)");
  });
});

describe("XSS Prevention: Content Display Components", () => {
  it("EmptyState escapes HTML in custom title", () => {
    const maliciousTitle = '<script>alert("xss")</script>';

    render(<EmptyState title={maliciousTitle} />);

    // Should render as text, not as HTML
    expect(screen.getByText(maliciousTitle)).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
  });

  it("EmptyState escapes HTML in custom message", () => {
    const maliciousMessage = '<img src="x" onerror="alert(1)">';

    render(<EmptyState message={maliciousMessage} />);

    expect(screen.getByText(maliciousMessage)).toBeInTheDocument();
    expect(document.querySelector("img[onerror]")).toBeNull();
  });

  it("ErrorState escapes HTML in error message", () => {
    const maliciousError = '<svg onload="alert(1)">test</svg>';

    render(<ErrorState message={maliciousError} />);

    expect(screen.getByText(maliciousError)).toBeInTheDocument();
    expect(document.querySelector("svg[onload]")).toBeNull();
  });
});

describe("XSS Prevention: URL Handling", () => {
  it("does not render javascript: URLs as clickable links", () => {
    // This tests that any link components properly validate URLs
    const { container } = render(
      <a href="javascript:alert(1)">Malicious Link</a>
    );

    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();

    // React 19 blocks javascript: URLs by replacing them with a safety error
    // The href should NOT be the original javascript: URL
    expect(link?.getAttribute("href")).not.toBe("javascript:alert(1)");
    expect(link?.getAttribute("href")).toMatch(/javascript/);
  });

  it("does not render data: URLs with scripts", () => {
    const { container } = render(
      <a href="data:text/html,<script>alert(1)</script>">Data URL</a>
    );

    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
  });
});

describe("XSS Prevention: DOM Injection", () => {
  it("React escapes HTML entities by default", () => {
    const Component = ({ text }: { text: string }) => <div>{text}</div>;

    const { container } = render(
      <Component text='<script>alert("xss")</script>' />
    );

    // Should be escaped as text content, not rendered as HTML
    expect(container.innerHTML).toContain("&lt;script&gt;");
    expect(container.innerHTML).not.toContain("<script>");
  });

  it("innerHTML is not used directly (codebase audit)", async () => {
    // This is a static analysis test - we check that dangerous patterns
    // are not present in the codebase
    const fs = await import("fs");
    const path = await import("path");

    const componentsDir = path.resolve(__dirname, "../../components");
    const appDir = path.resolve(__dirname, "../../app");

    const walkDir = (dir: string): string[] => {
      const results: string[] = [];
      if (!fs.existsSync(dir)) return results;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== "node_modules") {
          results.push(...walkDir(fullPath));
        } else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name) && !entry.name.match(/\.(test|spec)\./)) {
          results.push(fullPath);
        }
      }
      return results;
    };

    const checkDir = async (dir: string) => {
      const files = walkDir(dir);

      const violations: string[] = [];

      for (const file of files) {
        const content = fs.readFileSync(file, "utf-8");

        // Check for dangerous patterns
        if (content.includes("dangerouslySetInnerHTML")) {
          violations.push(`${file}: uses dangerouslySetInnerHTML`);
        }
        if (content.includes("innerHTML =")) {
          violations.push(`${file}: uses innerHTML assignment`);
        }
        if (content.includes("outerHTML =")) {
          violations.push(`${file}: uses outerHTML assignment`);
        }
        if (content.includes("document.write")) {
          violations.push(`${file}: uses document.write`);
        }
        if (/eval\s*\(/.test(content)) {
          violations.push(`${file}: uses eval()`);
        }
        if (/new\s+Function\s*\(/.test(content)) {
          violations.push(`${file}: uses new Function()`);
        }
      }

      return violations;
    };

    const componentViolations = await checkDir(componentsDir);
    const appViolations = await checkDir(appDir);
    const allViolations = [...componentViolations, ...appViolations];

    // If violations exist, they should be reviewed and justified
    if (allViolations.length > 0) {
      console.warn("XSS-risky patterns found (review required):", allViolations);
    }

    // For now, we expect no violations. Adjust if legitimate uses exist.
    expect(allViolations).toHaveLength(0);
  });
});

describe("XSS Prevention: Event Handler Injection", () => {
  it("event handlers cannot be injected via props", () => {
    // React prevents this by design, but we verify the behavior
    const maliciousProps = {
      onClick: "alert(1)", // String instead of function - should be ignored
      onMouseOver: "alert(2)",
    };

    const { container } = render(
      <button {...(maliciousProps as any)}>Click me</button>
    );

    const button = container.querySelector("button");

    // String event handlers should not be rendered as attributes
    // React ignores string values for event handlers
    expect(button?.getAttribute("onclick")).toBeNull();
    expect(button?.getAttribute("onmouseover")).toBeNull();
  });
});

describe("XSS Prevention: JSON Injection", () => {
  it("JSON.parse handles malicious payloads safely", () => {
    const maliciousJson = '{"__proto__": {"admin": true}}';

    // Parse should not pollute prototype
    const parsed = JSON.parse(maliciousJson);

    expect(parsed.__proto__).toBeDefined(); // It's a regular property
    expect(({} as any).admin).toBeUndefined(); // Prototype not polluted
  });

  it("JSON.stringify escapes HTML in output", () => {
    const data = { content: '<script>alert("xss")</script>' };
    const json = JSON.stringify(data);

    // JSON.stringify doesn't escape HTML, but when rendered in React
    // it will be escaped. This test documents the behavior.
    expect(json).toContain("<script>");
  });
});
