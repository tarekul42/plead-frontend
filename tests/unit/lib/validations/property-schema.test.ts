import { describe, it, expect } from "vitest";
import { propertySchema } from "@/lib/validations/property";

describe("propertySchema", () => {
  const validProperty = {
    title: "Modern Downtown Loft",
    description: "A beautiful modern loft in the heart of downtown with great views.",
    price: 550000,
    location: "Austin, TX",
    address: "123 Main St, Austin, TX 73301",
    beds: 2,
    baths: 2,
    area: 1200,
    propertyType: "condo",
    status: "available",
    images: ["https://example.com/img1.jpg"],
    features: ["Pool", "Gym"],
    assignedAgentId: "agent-1",
  };

  it("validates a correct property object", () => {
    const result = propertySchema.safeParse(validProperty);
    expect(result.success).toBe(true);
  });

  it("requires title with minimum 3 characters", () => {
    const result = propertySchema.safeParse({ ...validProperty, title: "ab" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Title must be at least 3 characters");
    }
  });

  it("requires title with maximum 200 characters", () => {
    const result = propertySchema.safeParse({ ...validProperty, title: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("requires description with minimum 10 characters", () => {
    const result = propertySchema.safeParse({ ...validProperty, description: "short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Description must be at least 10 characters");
    }
  });

  it("requires description with maximum 2000 characters", () => {
    const result = propertySchema.safeParse({ ...validProperty, description: "a".repeat(2001) });
    expect(result.success).toBe(false);
  });

  it("requires positive price", () => {
    const result = propertySchema.safeParse({ ...validProperty, price: -100 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Price must be positive");
    }
  });

  it("allows zero price", () => {
    const result = propertySchema.safeParse({ ...validProperty, price: 0 });
    expect(result.success).toBe(true);
  });

  it("requires location", () => {
    const result = propertySchema.safeParse({ ...validProperty, location: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Location is required");
    }
  });

  it("allows beds between 0 and 100", () => {
    const valid = propertySchema.safeParse({ ...validProperty, beds: 0 });
    expect(valid.success).toBe(true);

    const invalid = propertySchema.safeParse({ ...validProperty, beds: 101 });
    expect(invalid.success).toBe(false);
  });

  it("allows baths between 0 and 100", () => {
    const valid = propertySchema.safeParse({ ...validProperty, baths: 50 });
    expect(valid.success).toBe(true);

    const invalid = propertySchema.safeParse({ ...validProperty, baths: -1 });
    expect(invalid.success).toBe(false);
  });

  it("requires positive area", () => {
    const result = propertySchema.safeParse({ ...validProperty, area: -50 });
    expect(result.success).toBe(false);
  });

  it("requires valid propertyType enum", () => {
    const result = propertySchema.safeParse({ ...validProperty, propertyType: "castle" });
    expect(result.success).toBe(false);
  });

  it("accepts all valid property types", () => {
    const types = ["house", "apartment", "condo", "townhouse", "land", "commercial"] as const;
    types.forEach((type) => {
      const result = propertySchema.safeParse({ ...validProperty, propertyType: type });
      expect(result.success).toBe(true);
    });
  });

  it("allows optional status", () => {
    const result = propertySchema.safeParse({ ...validProperty, status: undefined });
    expect(result.success).toBe(true);
  });

  it("accepts valid status values", () => {
    const statuses = ["available", "sold", "rented", "pending"] as const;
    statuses.forEach((status) => {
      const result = propertySchema.safeParse({ ...validProperty, status });
      expect(result.success).toBe(true);
    });
  });

  it("requires at least one image", () => {
    const result = propertySchema.safeParse({ ...validProperty, images: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("At least one image is required");
    }
  });

  it("allows optional fields", () => {
    const minimal = {
      title: "Test Property",
      description: "A nice place to live with enough detail.",
      price: 100000,
      location: "Test City",
      beds: 1,
      baths: 1,
      area: 500,
      propertyType: "house" as const,
      images: ["https://example.com/img.jpg"],
    };
    const result = propertySchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("coerces string numbers for numeric fields", () => {
    const result = propertySchema.safeParse({
      ...validProperty,
      price: "550000",
      beds: "2",
      baths: "2",
      area: "1200",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(550000);
      expect(result.data.beds).toBe(2);
    }
  });
});
