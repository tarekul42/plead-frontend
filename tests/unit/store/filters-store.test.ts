import { describe, it, expect, beforeEach } from "vitest";
import { useFiltersStore } from "@/store/filters-store";

describe("filters-store", () => {
  beforeEach(() => {
    useFiltersStore.setState({
      search: "",
      propertyType: null,
      priceMin: null,
      priceMax: null,
      beds: null,
      status: null,
    });
  });

  it("sets search term", () => {
    useFiltersStore.getState().setSearch("downtown");
    expect(useFiltersStore.getState().search).toBe("downtown");
  });

  it("toggles property type", () => {
    useFiltersStore.getState().togglePropertyType("house");
    expect(useFiltersStore.getState().propertyType).toBe("house");
    useFiltersStore.getState().togglePropertyType("house");
    expect(useFiltersStore.getState().propertyType).toBeNull();
  });

  it("sets price range", () => {
    useFiltersStore.getState().setPriceRange(100000, 500000);
    expect(useFiltersStore.getState().priceMin).toBe(100000);
    expect(useFiltersStore.getState().priceMax).toBe(500000);
  });

  it("sets beds", () => {
    useFiltersStore.getState().setBeds(3);
    expect(useFiltersStore.getState().beds).toBe(3);
  });

  it("sets status", () => {
    useFiltersStore.getState().setStatus("available");
    expect(useFiltersStore.getState().status).toBe("available");
  });

  it("resets all filters", () => {
    useFiltersStore.getState().setSearch("test");
    useFiltersStore.getState().togglePropertyType("condo");
    useFiltersStore.getState().setPriceRange(200, 500);
    useFiltersStore.getState().reset();
    expect(useFiltersStore.getState()).toMatchObject({
      search: "",
      propertyType: null,
      priceMin: null,
      priceMax: null,
      beds: null,
      status: null,
    });
  });
});
