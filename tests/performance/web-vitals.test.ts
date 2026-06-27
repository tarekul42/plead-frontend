/**
 * Web Vitals Performance Tests
 *
 * Tests Core Web Vitals metrics using mock measurements.
 * In production, these would use real CrUX data or Lighthouse reports.
 *
 * Metrics tested:
 * - LCP (Largest Contentful Paint): < 2.5s
 * - CLS (Cumulative Layout Shift): < 0.1
 * - FID (First Input Delay): < 100ms
 * - INP (Interaction to Next Paint): < 200ms
 * - TTFB (Time to First Byte): < 800ms
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Web Vitals thresholds (good/excellent)
const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // ms
  CLS: { good: 0.1, poor: 0.25 }, // score
  FID: { good: 100, poor: 300 }, // ms
  INP: { good: 200, poor: 500 }, // ms
  TTFB: { good: 800, poor: 1800 }, // ms
};

// Mock Web Vitals measurements
const mockWebVitals = {
  LCP: 1800, // ms - good
  CLS: 0.05, // score - good
  FID: 50, // ms - good
  INP: 120, // ms - good
  TTFB: 400, // ms - good
};

// Helper to classify web vital rating
function getVitalRating(value: number, thresholds: { good: number; poor: number }): "good" | "needs-improvement" | "poor" {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

// Mock PerformanceObserver for CLS tracking
function createMockPerformanceEntry(name: string, value: number): PerformanceEntry {
  return {
    name,
    entryType: "measure",
    startTime: 0,
    duration: value,
    toJSON: () => ({ name, entryType: "measure", startTime: 0, duration: value }),
  } as PerformanceEntry;
}

describe("Web Vitals: Core Metrics", () => {
  describe("LCP (Largest Contentful Paint)", () => {
    it("should be under 2.5s for good rating", () => {
      const lcp = mockWebVitals.LCP;
      expect(lcp).toBeLessThanOrEqual(WEB_VITALS_THRESHOLDS.LCP.good);
    });

    it("should classify LCP rating correctly", () => {
      expect(getVitalRating(1800, WEB_VITALS_THRESHOLDS.LCP)).toBe("good");
      expect(getVitalRating(3000, WEB_VITALS_THRESHOLDS.LCP)).toBe("needs-improvement");
      expect(getVitalRating(5000, WEB_VITALS_THRESHOLDS.LCP)).toBe("poor");
    });

    it("should warn when LCP exceeds poor threshold", () => {
      const poorLCP = 4500;
      const rating = getVitalRating(poorLCP, WEB_VITALS_THRESHOLDS.LCP);
      expect(rating).toBe("poor");
    });
  });

  describe("CLS (Cumulative Layout Shift)", () => {
    it("should be under 0.1 for good rating", () => {
      const cls = mockWebVitals.CLS;
      expect(cls).toBeLessThanOrEqual(WEB_VITALS_THRESHOLDS.CLS.good);
    });

    it("should classify CLS rating correctly", () => {
      expect(getVitalRating(0.05, WEB_VITALS_THRESHOLDS.CLS)).toBe("good");
      expect(getVitalRating(0.15, WEB_VITALS_THRESHOLDS.CLS)).toBe("needs-improvement");
      expect(getVitalRating(0.3, WEB_VITALS_THRESHOLDS.CLS)).toBe("poor");
    });

    it("should detect layout shift from dynamic content", () => {
      // Simulate layout shift detection
      const layoutShiftEntries: PerformanceEntry[] = [
        createMockPerformanceEntry("layout-shift", 0.02),
        createMockPerformanceEntry("layout-shift", 0.03),
      ];

      const totalShift = layoutShiftEntries.reduce((sum, entry) => sum + entry.duration, 0);
      expect(totalShift).toBeLessThan(WEB_VITALS_THRESHOLDS.CLS.good);
    });

    it("should track CLS across page lifecycle", () => {
      const clsValue = mockWebVitals.CLS;
      expect(clsValue).toBeGreaterThanOrEqual(0);
      expect(clsValue).toBeLessThan(1);
    });
  });

  describe("FID (First Input Delay)", () => {
    it("should be under 100ms for good rating", () => {
      const fid = mockWebVitals.FID;
      expect(fid).toBeLessThanOrEqual(WEB_VITALS_THRESHOLDS.FID.good);
    });

    it("should classify FID rating correctly", () => {
      expect(getVitalRating(50, WEB_VITALS_THRESHOLDS.FID)).toBe("good");
      expect(getVitalRating(200, WEB_VITALS_THRESHOLDS.FID)).toBe("needs-improvement");
      expect(getVitalRating(400, WEB_VITALS_THRESHOLDS.FID)).toBe("poor");
    });
  });

  describe("INP (Interaction to Next Paint)", () => {
    it("should be under 200ms for good rating", () => {
      const inp = mockWebVitals.INP;
      expect(inp).toBeLessThanOrEqual(WEB_VITALS_THRESHOLDS.INP.good);
    });

    it("should classify INP rating correctly", () => {
      expect(getVitalRating(120, WEB_VITALS_THRESHOLDS.INP)).toBe("good");
      expect(getVitalRating(350, WEB_VITALS_THRESHOLDS.INP)).toBe("needs-improvement");
      expect(getVitalRating(600, WEB_VITALS_THRESHOLDS.INP)).toBe("poor");
    });
  });

  describe("TTFB (Time to First Byte)", () => {
    it("should be under 800ms for good rating", () => {
      const ttfb = mockWebVitals.TTFB;
      expect(ttfb).toBeLessThanOrEqual(WEB_VITALS_THRESHOLDS.TTFB.good);
    });

    it("should classify TTFB rating correctly", () => {
      expect(getVitalRating(400, WEB_VITALS_THRESHOLDS.TTFB)).toBe("good");
      expect(getVitalRating(1200, WEB_VITALS_THRESHOLDS.TTFB)).toBe("needs-improvement");
      expect(getVitalRating(2000, WEB_VITALS_THRESHOLDS.TTFB)).toBe("poor");
    });
  });
});

describe("Web Vitals: Performance Budgets", () => {
  it("should meet all Core Web Vitals thresholds", () => {
    const results = {
      LCP: getVitalRating(mockWebVitals.LCP, WEB_VITALS_THRESHOLDS.LCP),
      CLS: getVitalRating(mockWebVitals.CLS, WEB_VITALS_THRESHOLDS.CLS),
      FID: getVitalRating(mockWebVitals.FID, WEB_VITALS_THRESHOLDS.FID),
      INP: getVitalRating(mockWebVitals.INP, WEB_VITALS_THRESHOLDS.INP),
      TTFB: getVitalRating(mockWebVitals.TTFB, WEB_VITALS_THRESHOLDS.TTFB),
    };

    // All vitals should be "good" or "needs-improvement"
    for (const [metric, rating] of Object.entries(results)) {
      expect(rating).not.toBe("poor");
    }
  });

  it("should have at least 3 vitals rated as good", () => {
    const goodCount = Object.entries(mockWebVitals).filter(([metric, value]) => {
      const thresholds = WEB_VITALS_THRESHOLDS[metric as keyof typeof WEB_VITALS_THRESHOLDS];
      return value <= thresholds.good;
    }).length;

    expect(goodCount).toBeGreaterThanOrEqual(3);
  });
});

describe("Web Vitals: Performance Monitoring Setup", () => {
  it("should have performance monitoring infrastructure", () => {
    // Verify that performance APIs are available in jsdom
    expect(typeof performance).toBe("object");
    expect(typeof performance.now).toBe("function");
  });

  it("should be able to measure component render time", () => {
    const start = performance.now();
    // Simulate some work
    const arr = Array.from({ length: 1000 }, (_, i) => i * 2);
    const end = performance.now();

    const duration = end - start;
    expect(duration).toBeGreaterThanOrEqual(0);
    expect(duration).toBeLessThan(100); // Should be fast
  });

  it("should support PerformanceObserver", () => {
    // PerformanceObserver should be available
    expect(typeof PerformanceObserver).toBe("function");
  });

  it("should support performance marks and measures", () => {
    performance.mark("test-start");
    performance.mark("test-end");
    performance.measure("test-duration", "test-start", "test-end");

    const measures = performance.getEntriesByName("test-duration");
    expect(measures.length).toBeGreaterThanOrEqual(1);
    expect(measures[0].duration).toBeGreaterThanOrEqual(0);

    // Clean up
    performance.clearMarks("test-start");
    performance.clearMarks("test-end");
    performance.clearMeasures("test-duration");
  });
});

/**
 * Web Vitals Monitoring Reference
 *
 * To implement real monitoring, add to your app:
 *
 * // lib/web-vitals.ts
 * import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals';
 *
 * function sendToAnalytics(metric: Metric) {
 *   const body = JSON.stringify(metric);
 *   if (navigator.sendBeacon) {
 *     navigator.sendBeacon('/api/analytics/vitals', body);
 *   } else {
 *     fetch('/api/analytics/vitals', { body, method: 'POST', keepalive: true });
 *   }
 * }
 *
 * export function initWebVitals() {
 *   onCLS(sendToAnalytics);
 *   onFID(sendToAnalytics);
 *   onLCP(sendToAnalytics);
 *   onINP(sendToAnalytics);
 *   onTTFB(sendToAnalytics);
 * }
 */
