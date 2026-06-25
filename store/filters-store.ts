import { create } from "zustand";

interface FiltersState {
  search: string;
  propertyType: string | null;
  priceMin: number | null;
  priceMax: number | null;
  beds: number | null;
  status: string | null;
  setSearch: (search: string) => void;
  togglePropertyType: (type: string) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setBeds: (beds: number | null) => void;
  setStatus: (status: string | null) => void;
  reset: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  search: "",
  propertyType: null,
  priceMin: null,
  priceMax: null,
  beds: null,
  status: null,
  setSearch: (search) => set({ search }),
  togglePropertyType: (type) =>
    set((state) => ({
      propertyType: state.propertyType === type ? null : type,
    })),
  setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
  setBeds: (beds) => set({ beds }),
  setStatus: (status) => set({ status }),
  reset: () =>
    set({
      search: "",
      propertyType: null,
      priceMin: null,
      priceMax: null,
      beds: null,
      status: null,
    }),
}));
