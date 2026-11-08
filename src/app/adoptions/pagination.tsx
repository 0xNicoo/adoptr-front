import Link from "next/link";
import { CatalogQuery, catalogHref } from "@/lib/adoption/catalog-query";

const pill =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-3 border-ink px-4 font-bold " +
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal";

/** Páginas visibles: la primera, la última y dos alrededor de la actual. */
function visiblePages(current: number, total: number): (number | "…")[] {
  const pages = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push("…");
    result.push(page);
  });
  return result;
}

export default function Pagination({ query, totalPages }: { query: CatalogQuery; totalPages: number }) {
  if (totalPages <= 1) return null;
  const { page } = query;
  const href = (target: number) => catalogHref({ ...query, page: target });

  return (
    <nav aria-label="Páginas" className="flex flex-col items-center gap-3">
      <ul className="flex flex-wrap items-center justify-center gap-2.5">
        {page > 1 && (
          <li>
            <Link href={href(page - 1)} className={`${pill} bg-surface`}>
              Anterior
            </Link>
          </li>
        )}
        {visiblePages(page, totalPages).map((item, i) =>
          item === "…" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 font-bold text-ink-soft">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={href(item)}
                aria-current={item === page ? "page" : undefined}
                className={`${pill} ${item === page ? "bg-ink text-surface" : "bg-surface"}`}
              >
                <span className="sr-only">Página </span>
                {item}
              </Link>
            </li>
          ),
        )}
        {page < totalPages && (
          <li>
            <Link href={href(page + 1)} className={`${pill} bg-surface shadow-hard`}>
              Siguiente
            </Link>
          </li>
        )}
      </ul>
      <p className="text-sm text-ink-soft">
        Página {page} de {totalPages}
      </p>
    </nav>
  );
}
