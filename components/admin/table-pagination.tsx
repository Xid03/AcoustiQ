"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type TablePaginationProps = {
  currentPage?: number;
  label?: string;
  lastPage?: string | number;
  onPageChange?: (page: number) => void;
};

export function TablePagination({
  currentPage = 1,
  label = "Showing 1 to 8 of 128 results",
  lastPage = "16",
  onPageChange
}: TablePaginationProps) {
  const pageCount = Number(lastPage);
  const pages =
    pageCount <= 1
      ? ["1"]
      : pageCount <= 4
        ? Array.from({ length: pageCount }, (_, index) => String(index + 1))
        : ["1", "2", "3", "4", "...", String(lastPage)];

  return (
    <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 min-h-9 w-9"
          aria-label="Previous page"
          disabled={pageCount <= 1 || currentPage <= 1}
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`${page}-${index}`}
              className="flex h-9 min-w-9 items-center justify-center px-2 text-sm text-slate-500"
            >
              ...
            </span>
          ) : (
            <button
              key={`${page}-${index}`}
              type="button"
              className={
                page === String(currentPage)
                  ? "h-9 min-w-9 rounded-lg border border-indigo-500 bg-indigo-50 px-3 text-sm font-medium text-indigo-700 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  : "h-9 min-w-9 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              }
              onClick={() => onPageChange?.(Number(page))}
            >
              {page}
            </button>
          )
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 min-h-9 w-9"
          aria-label="Next page"
          disabled={pageCount <= 1 || currentPage >= pageCount}
          onClick={() => onPageChange?.(Math.min(pageCount, currentPage + 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
