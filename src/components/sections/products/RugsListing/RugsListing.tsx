"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import type { FilterGroupKey, ProductListItemData, RugsListingProps } from "./RugsListing.types";

const PLACEHOLDER = new Set(["none", "None", "custom", "Custom", ""]);
const FILTER_GROUP_DEFS: { key: FilterGroupKey; label: string }[] = [
  { key: "weavingStyle", label: "Weaving Style" },
  { key: "composition", label: "Composition" },
  { key: "size", label: "Size" },
];

// Same transform as the real source's own `prettify()` (ProductsListing.astro).
function prettify(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Verbatim port of the real source's `normalizeFilterValue()` — makes
// "8 x 10" / "8x10" / "8 X 10" / "8 × 10" / "8' x 10'" all comparable.
// NOT my own interpretation: strips whitespace and prime/apostrophe
// characters but deliberately leaves straight double-quotes (inch marks)
// untouched, exactly as the real regex does.
function normalizeFilterValue(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[′’']/g, "")
    .replace(/×/g, "x");
}

function productMatchesGroup(product: ProductListItemData, key: FilterGroupKey, selected: Set<string>): boolean {
  if (selected.size === 0) return true;
  const rawValue = product[key] ?? "";
  // Size can carry several values joined by "|||" if ever seeded that
  // way (matches the real source's own array-size support) — splitting
  // a plain single-size string is a safe no-op.
  const productValues = key === "size" ? rawValue.split("|||") : [rawValue];
  const normalizedProductValues = productValues.map(normalizeFilterValue);
  return [...selected].some((val) => normalizedProductValues.includes(normalizeFilterValue(val)));
}

// Shared by the desktop dropdown (operates on activeFilters, applies
// instantly) and the mobile off-canvas drawer (operates on stagedFilters,
// applies on "Show N Pieces") — same checkbox list, different state fed
// in by the caller.
function FilterGroupCheckboxes({
  groups,
  selected,
  onToggle,
}: {
  groups: { key: FilterGroupKey; label: string; options: string[] }[];
  selected: Record<FilterGroupKey, Set<string>>;
  onToggle: (key: FilterGroupKey, value: string) => void;
}) {
  return (
    <>
      {groups.map((group, i) => (
        <div key={group.key} className={i > 0 ? "mt-4 border-t border-stone-100 pt-4" : ""}>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">{group.label}</p>
          <div className="space-y-0.5">
            {group.options.map((option) => {
              const isChecked = selected[group.key].has(option);
              return (
                <button
                  key={option}
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => onToggle(group.key, option)}
                  className="group flex w-full items-center gap-2.5 py-1.5 text-left"
                >
                  <span
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-colors duration-150 group-hover:border-stone-600 ${isChecked ? "border-stone-900" : "border-stone-300"}`}
                  >
                    <span className={`h-1.5 w-1.5 bg-stone-900 ${isChecked ? "" : "hidden"}`} />
                  </span>
                  <span
                    className={`text-[11px] uppercase tracking-[0.16em] transition-colors duration-150 group-hover:text-stone-900 ${isChecked ? "font-semibold text-stone-900" : "text-stone-500"}`}
                  >
                    {prettify(option)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

function pillClass(isActive: boolean): string {
  return `border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200 ${
    isActive ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-500"
  }`;
}

// Ported from the real source's ProductsListing.astro — same component
// shared by /rugs (`defaultCategory="Rug"`) and, in principle, any
// future category. Filtering/search is fully client-side over the
// already-fetched active product list (real source does the same: a
// static-site inline <script>, no API calls), reimplemented here as
// React state rather than direct DOM manipulation. Two deliberate
// translation notes, not behavior changes:
// - The search input is a genuinely separate piece of state from the
//   normalized query used for matching (lowercased/trimmed only at
//   filter time), so the visible textbox shows exactly what's typed —
//   the real source's own DOM input is uncontrolled the same way; only
//   its internal `searchQuery` variable was ever normalized.
// - "Clear filters" (both the filter panel's "Clear all" and the
//   no-results empty state's "Clear filters") only clears the checkbox
//   filter groups — NOT search, category, or the In Stock toggle.
//   Confirmed from the real source: both buttons call the exact same
//   `clearFilters()`, which only touches `active[key]`.
export default function RugsListing({ products, defaultCategory = "", className = "" }: RugsListingProps) {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<FilterGroupKey, Set<string>>>({
    weavingStyle: new Set(),
    composition: new Set(),
    size: new Set(),
  });
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  // Mobile-only staged copy of activeFilters — the off-canvas drawer lets
  // multiple selections build up without refiltering the grid underneath
  // until "Show N Pieces" is tapped, unlike the desktop dropdown (which
  // still applies each click immediately). Reset from activeFilters every
  // time the panel opens, so reopening without applying always starts
  // from what's actually live, not a stale half-finished selection.
  const [stagedFilters, setStagedFilters] = useState<Record<FilterGroupKey, Set<string>>>({
    weavingStyle: new Set(),
    composition: new Set(),
    size: new Set(),
  });

  const filterContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterContainerRef.current && !filterContainerRef.current.contains(e.target as Node)) {
        setFilterPanelOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Scroll lock while the mobile off-canvas drawer is open — same
  // fixed-position technique as layouts/Header's mobile menu (restores
  // the exact scroll position on close instead of jumping to the top).
  // Skipped above the md breakpoint since the desktop dropdown doesn't
  // cover the page and shouldn't block background scrolling.
  useEffect(() => {
    if (!filterPanelOpen) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const scrollY = window.scrollY;
    const html = document.documentElement.style;
    const body = document.body.style;

    html.overflow = "hidden";
    html.height = "100%";
    body.overflow = "hidden";
    body.position = "fixed";
    body.top = `-${scrollY}px`;
    body.left = "0";
    body.right = "0";
    body.width = "100%";

    return () => {
      html.overflow = "";
      html.height = "";
      body.overflow = "";
      body.position = "";
      body.top = "";
      body.left = "";
      body.right = "";
      body.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [filterPanelOpen]);

  const normalizedSearch = useMemo(() => searchInputValue.toLowerCase().trim(), [searchInputValue]);

  const filterGroups = useMemo(() => {
    return FILTER_GROUP_DEFS.map((def) => {
      const values = new Set<string>();
      products.forEach((product) => {
        const value = product[def.key];
        if (value && !PLACEHOLDER.has(value)) values.add(value);
      });
      return { ...def, options: [...values].sort() };
    }).filter((group) => group.options.length > 0);
  }, [products]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesGroups = (Object.keys(activeFilters) as FilterGroupKey[]).every((key) =>
        productMatchesGroup(product, key, activeFilters[key])
      );
      const matchesSearch = normalizedSearch === "" || product.title.toLowerCase().includes(normalizedSearch);
      const matchesCategory = activeCategory === "" || product.category === activeCategory;
      const matchesStock = !onlyInStock || product.inStock;
      return matchesGroups && matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, activeFilters, normalizedSearch, activeCategory, onlyInStock]);

  const totalActiveFilterCount = useMemo(
    () => Object.values(activeFilters).reduce((n, set) => n + set.size, 0),
    [activeFilters]
  );

  const totalStagedFilterCount = useMemo(
    () => Object.values(stagedFilters).reduce((n, set) => n + set.size, 0),
    [stagedFilters]
  );

  // Live "Show N Pieces" preview for the mobile drawer's Apply button —
  // same predicate as filteredProducts above, evaluated against the
  // staged (not yet committed) selection.
  const stagedMatchCount = useMemo(() => {
    return products.filter((product) => {
      const matchesGroups = (Object.keys(stagedFilters) as FilterGroupKey[]).every((key) =>
        productMatchesGroup(product, key, stagedFilters[key])
      );
      const matchesSearch = normalizedSearch === "" || product.title.toLowerCase().includes(normalizedSearch);
      const matchesCategory = activeCategory === "" || product.category === activeCategory;
      const matchesStock = !onlyInStock || product.inStock;
      return matchesGroups && matchesSearch && matchesCategory && matchesStock;
    }).length;
  }, [products, stagedFilters, normalizedSearch, activeCategory, onlyInStock]);

  const anyActiveFilter =
    totalActiveFilterCount > 0 || normalizedSearch !== "" || activeCategory !== "" || onlyInStock;
  const noResultsVisible = filteredProducts.length === 0 && anyActiveFilter;

  function toggleFilterValue(key: FilterGroupKey, value: string) {
    setActiveFilters((prev) => {
      const next = new Set(prev[key]);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [key]: next };
    });
  }

  function removeFilterValue(key: FilterGroupKey, value: string) {
    setActiveFilters((prev) => {
      const next = new Set(prev[key]);
      next.delete(value);
      return { ...prev, [key]: next };
    });
  }

  function clearFilters() {
    setActiveFilters({ weavingStyle: new Set(), composition: new Set(), size: new Set() });
  }

  function toggleStagedFilterValue(key: FilterGroupKey, value: string) {
    setStagedFilters((prev) => {
      const next = new Set(prev[key]);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [key]: next };
    });
  }

  function clearStagedFilters() {
    setStagedFilters({ weavingStyle: new Set(), composition: new Set(), size: new Set() });
  }

  function applyStagedFilters() {
    setActiveFilters(stagedFilters);
    setFilterPanelOpen(false);
  }

  function toggleFilterPanel() {
    setFilterPanelOpen((open) => {
      const next = !open;
      if (next) {
        setStagedFilters({
          weavingStyle: new Set(activeFilters.weavingStyle),
          composition: new Set(activeFilters.composition),
          size: new Set(activeFilters.size),
        });
      }
      return next;
    });
  }

  function toggleSearchOpen() {
    setSearchOpen((open) => {
      const next = !open;
      if (!next) setSearchInputValue("");
      return next;
    });
  }

  if (products.length === 0) {
    return (
      <section className={`px-5 pb-32 md:px-10 lg:px-16 ${className}`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <p className="font-didot text-xl text-stone-300">No pieces available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`px-5 pb-32 md:px-10 lg:px-16 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-[11px] uppercase tracking-[0.2em] text-stone-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
            </span>

            {/* Single-row horizontal scroller, not flex-wrap — with many
                active filters this reads as a swipeable strip instead of
                pushing the layout taller. min-w-0 lets this shrink below
                its content's natural width inside the flex row, which is
                what lets overflow-x-auto actually kick in instead of the
                row just growing wider. Scrollbar hidden the same way
                ProductGallery's thumbnail strip does. */}
            <div
              className="flex min-w-0 gap-2 overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {(Object.keys(activeFilters) as FilterGroupKey[]).flatMap((key) =>
                [...activeFilters[key]].map((value) => (
                  <button
                    key={`${key}-${value}`}
                    type="button"
                    onClick={() => removeFilterValue(key, value)}
                    className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap border border-stone-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600 transition-colors hover:border-stone-600 hover:text-stone-900"
                  >
                    {prettify(value)}
                    <span aria-hidden="true" className="ml-0.5 text-stone-400">
                      ×
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <div className="group flex items-center gap-2">
              <div
                className={`flex overflow-hidden transition-[max-width] duration-300 ease-in-out ${
                  searchOpen ? "max-w-[min(45vw,200px)]" : "max-w-0 group-hover:max-w-[11rem]"
                }`}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search pieces…"
                  autoComplete="off"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  className="w-44 max-w-full border-b border-stone-300 bg-transparent py-0.5 text-[11px] uppercase tracking-[0.15em] text-stone-900 outline-none transition-colors duration-200 placeholder:text-stone-400 focus:border-stone-700"
                />
              </div>

              <button
                type="button"
                aria-label="Search"
                onClick={toggleSearchOpen}
                className="relative flex h-7 w-7 items-center justify-center text-stone-500 transition-colors hover:text-stone-900"
              >
                <svg
                  className={`h-4 w-4 ${searchOpen ? "hidden" : "group-hover:hidden"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.197 5.197a7.5 7.5 0 0 0 10.606 10.606z" />
                </svg>
                <svg
                  className={`h-4 w-4 ${searchOpen ? "block" : "hidden group-hover:block"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {filterGroups.length > 0 && (
              <div className="relative" ref={filterContainerRef}>
                <button
                  type="button"
                  onClick={toggleFilterPanel}
                  className="flex items-center gap-2 text-[11px] font-semibold uppercase leading-none tracking-[0.25em] text-stone-700 transition-colors hover:text-stone-900"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  Filters
                  {totalActiveFilterCount > 0 && (
                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-900 px-1 text-[9px] leading-none text-white">
                      {totalActiveFilterCount}
                    </span>
                  )}
                </button>

                {/* Desktop dropdown — md and up only. Applies each click
                    immediately (no staging/Apply step), unchanged from
                    before. */}
                {filterPanelOpen && (
                  <div
                    className="absolute right-0 top-full z-20 mt-3 hidden w-72 border border-stone-200 bg-white shadow-lg md:block"
                    style={{ maxHeight: "70vh", overflowY: "auto" }}
                  >
                    <div className="p-5">
                      <div className="mb-5 flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-900">Filters</span>
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-[10px] uppercase tracking-[0.2em] text-stone-400 transition-colors hover:text-stone-900"
                        >
                          Clear all
                        </button>
                      </div>

                      <FilterGroupCheckboxes groups={filterGroups} selected={activeFilters} onToggle={toggleFilterValue} />
                    </div>
                  </div>
                )}

                {/* Mobile off-canvas drawer — below md only. Selections
                    stage in stagedFilters and only apply to the grid when
                    "Show N Pieces" is tapped, so the list underneath
                    doesn't refilter/jump on every single tap while the
                    drawer is open. */}
                <div
                  className={`fixed inset-0 z-40 bg-stone-950/40 transition-opacity duration-300 md:hidden ${
                    filterPanelOpen ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                  onClick={() => setFilterPanelOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-[85vw] max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
                    filterPanelOpen ? "translate-x-0" : "translate-x-full"
                  }`}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Filters"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 px-5 py-5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-900">Filters</span>
                    <button
                      type="button"
                      onClick={() => setFilterPanelOpen(false)}
                      aria-label="Close filters"
                      className="text-stone-500 transition-colors hover:text-stone-900"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-5">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                        {totalStagedFilterCount} selected
                      </span>
                      <button
                        type="button"
                        onClick={clearStagedFilters}
                        className="text-[10px] uppercase tracking-[0.2em] text-stone-400 transition-colors hover:text-stone-900"
                      >
                        Clear all
                      </button>
                    </div>

                    <FilterGroupCheckboxes groups={filterGroups} selected={stagedFilters} onToggle={toggleStagedFilterValue} />
                  </div>

                  <div className="border-t border-stone-200 p-5">
                    <button
                      type="button"
                      onClick={applyStagedFilters}
                      className="w-full bg-stone-900 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-stone-700"
                    >
                      Show {stagedMatchCount} {stagedMatchCount === 1 ? "Piece" : "Pieces"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          {!defaultCategory && (
            <>
              <button type="button" onClick={() => setActiveCategory("")} className={pillClass(activeCategory === "")}>
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={pillClass(activeCategory === category)}
                >
                  {category}
                </button>
              ))}
              <span className="mx-1 h-4 w-px bg-stone-200" aria-hidden="true" />
            </>
          )}

          <button
            type="button"
            aria-pressed={onlyInStock}
            onClick={() => setOnlyInStock((v) => !v)}
            className={`flex items-center gap-2 ${pillClass(onlyInStock)}`}
          >
            <span
              className={`relative flex h-3 w-3 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${onlyInStock ? "border-white" : "border-stone-300"}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${onlyInStock ? "bg-white" : "bg-transparent"}`} />
            </span>
            In Stock
          </button>
        </div>

        {noResultsVisible && (
          <div className="flex flex-col items-center py-32 text-center">
            <div className="mb-5 h-px w-10 bg-stone-200" />
            <p className="font-didot text-xl text-stone-400">No pieces match your selection.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-8 text-[11px] uppercase tracking-[0.25em] text-stone-400 transition-colors hover:text-stone-900"
            >
              Clear filters
            </button>
          </div>
        )}

        {!noResultsVisible && (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 xl:grid-cols-4" role="list">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} {...product} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
