"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PropertySearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function PropertySearchBar({ value, onChange }: PropertySearchBarProps) {
  const [local, setLocal] = useState(value);
  const [debounced, setDebounced] = useState(value);
  const initiated = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(local), 300);
    return () => clearTimeout(timer);
  }, [local]);

  useEffect(() => {
    if (!initiated.current) {
      initiated.current = true;
      return;
    }
    onChangeRef.current(debounced);
  }, [debounced]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search by location, title, or features..."
        className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand"
      />
    </div>
  );
}
