import { describe, it, expect } from "vitest";
import { leadSchema } from "@/lib/validations/property";

describe("leadSchema", () => {
  const validLead = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-555-0101",
    budget: 500000,
    preferredLocation: "Austin, TX",
    bedsDesired: 3,
    bathsDesired: 2,
    notes: "Looking for a family home",
    status: "new",
    source: "website",
    assignedAgentId: "agent-1",
  };

  it("validates a correct lead object", () => {
    const result = leadSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("requires name", () => {
    const result = leadSchema.safeParse({ ...validLead, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is required");
    }
  });

  it("requires valid email", () => {
    const result = leadSchema.safeParse({ ...validLead, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid email");
    }
  });

  it("rejects invalid email formats", () => {
    const invalidEmails = ["@", "user@", "@domain.com", "user@.com", "user@domain"];
    invalidEmails.forEach((email) => {
      const result = leadSchema.safeParse({ ...validLead, email });
      expect(result.success).toBe(false);
    });
  });

  it("allows optional phone", () => {
    const result = leadSchema.safeParse({ ...validLead, phone: undefined });
    expect(result.success).toBe(true);
  });

  it("allows optional budget", () => {
    const result = leadSchema.safeParse({ ...validLead, budget: undefined });
    expect(result.success).toBe(true);
  });

  it("requires positive budget when provided", () => {
    const result = leadSchema.safeParse({ ...validLead, budget: -100 });
    expect(result.success).toBe(false);
  });

  it("allows zero budget", () => {
    const result = leadSchema.safeParse({ ...validLead, budget: 0 });
    expect(result.success).toBe(true);
  });

  it("allows optional preferredLocation", () => {
    const result = leadSchema.safeParse({ ...validLead, preferredLocation: undefined });
    expect(result.success).toBe(true);
  });

  it("allows optional bedsDesired", () => {
    const result = leadSchema.safeParse({ ...validLead, bedsDesired: undefined });
    expect(result.success).toBe(true);
  });

  it("requires bedsDesired to be non-negative when provided", () => {
    const result = leadSchema.safeParse({ ...validLead, bedsDesired: -1 });
    expect(result.success).toBe(false);
  });

  it("requires bathsDesired to be non-negative when provided", () => {
    const result = leadSchema.safeParse({ ...validLead, bathsDesired: -1 });
    expect(result.success).toBe(false);
  });

  it("allows optional notes", () => {
    const result = leadSchema.safeParse({ ...validLead, notes: undefined });
    expect(result.success).toBe(true);
  });

  it("allows optional status", () => {
    const result = leadSchema.safeParse({ ...validLead, status: undefined });
    expect(result.success).toBe(true);
  });

  it("allows optional source", () => {
    const result = leadSchema.safeParse({ ...validLead, source: undefined });
    expect(result.success).toBe(true);
  });

  it("requires assignedAgentId", () => {
    const { assignedAgentId: _, ...withoutAgent } = validLead;
    const result = leadSchema.safeParse(withoutAgent);
    expect(result.success).toBe(false);
  });

  it("allows minimal required fields only", () => {
    const minimal = {
      name: "Jane Doe",
      email: "jane@example.com",
      assignedAgentId: "agent-1",
    };
    const result = leadSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("coerces string numbers for numeric fields", () => {
    const result = leadSchema.safeParse({
      ...validLead,
      budget: "500000",
      bedsDesired: "3",
      bathsDesired: "2",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.budget).toBe(500000);
      expect(result.data.bedsDesired).toBe(3);
    }
  });
});
