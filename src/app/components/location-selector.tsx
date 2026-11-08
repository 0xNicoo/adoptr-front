"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchLocalitiesAction } from "@/actions/location";
import { Locality } from "@/lib/api/models/locality/locality";
import { Province } from "@/lib/api/models/locality/province";
import { FieldError, FieldHelp, Label, compactInputClass, compactLabelClass, inputClass } from "./ui/form-field";

const MIN_QUERY = 2;
const DEBOUNCE_MS = 300;

export interface LocationValue {
  provinceId: number | null;
  locality: Locality | null;
}

type Status = "idle" | "loading" | "done" | "error";

/**
 * Provincia y localidad del catálogo de Georef. La provincia se elige de una lista;
 * la localidad se busca escribiendo, porque son miles.
 *
 * `variant="filter"`: para barras de filtros. Ambos campos son opcionales («Todas»), compactos,
 * y se integran a la fila del contenedor (que debe ser `flex flex-wrap`); la lista de resultados
 * flota sobre el contenido para no agrandar la barra.
 */
export default function LocationSelector({
  provinces,
  value,
  onChange,
  provinceError,
  localityError,
  variant = "form",
}: {
  provinces: Province[];
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  provinceError?: string;
  localityError?: string;
  variant?: "form" | "filter";
}) {
  const id = useId();
  const provinceSelectId = `${id}-province`;
  const localityInputId = `${id}-locality`;
  const statusId = `${id}-status`;
  const filter = variant === "filter";
  const fieldClass = filter ? compactInputClass : inputClass;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Locality[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const lastRequest = useRef(0);

  const province = provinces.find((p) => p.id === value.provinceId) ?? null;
  const text = query.trim();

  // Busca con una pequeña espera entre teclas y descarta respuestas viejas.
  useEffect(() => {
    if (!province || value.locality || text.length < MIN_QUERY) {
      return;
    }
    const request = ++lastRequest.current;
    const timer = setTimeout(async () => {
      setStatus("loading");
      const result = await searchLocalitiesAction(province.id, text);
      if (request !== lastRequest.current) return;
      if (result.ok) {
        setResults(result.localities);
        setStatus("done");
      } else {
        setResults([]);
        setStatus("error");
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [province, value.locality, text]);

  function changeQuery(next: string) {
    setQuery(next);
    if (next.trim().length < MIN_QUERY) {
      lastRequest.current++;
      setResults([]);
      setStatus("idle");
    }
  }

  function selectProvince(raw: string) {
    changeQuery("");
    onChange({ provinceId: raw ? Number(raw) : null, locality: null });
  }

  function selectLocality(locality: Locality) {
    changeQuery("");
    onChange({ provinceId: value.provinceId, locality });
  }

  function clearLocality() {
    onChange({ provinceId: value.provinceId, locality: null });
  }

  const showResults = status === "done" && results.length > 0;

  const label = (htmlFor: string, text: string) =>
    filter ? (
      <label htmlFor={htmlFor} className={compactLabelClass}>
        {text}
      </label>
    ) : (
      <Label htmlFor={htmlFor}>{text}</Label>
    );

  const help = (content: string) =>
    filter ? <p className="mt-1 text-xs text-ink-soft">{content}</p> : <FieldHelp>{content}</FieldHelp>;

  return (
    <div className={filter ? "contents" : "flex flex-col gap-6"}>
      <div className={filter ? "min-w-40 flex-1" : ""}>
        {label(provinceSelectId, "Provincia")}
        <select
          id={provinceSelectId}
          className={fieldClass}
          value={value.provinceId ?? ""}
          onChange={(e) => selectProvince(e.target.value)}
          aria-invalid={provinceError ? true : undefined}
          aria-describedby={provinceError ? `${provinceSelectId}-error` : undefined}
        >
          <option value="">{filter ? "Todas" : "Elegí una provincia"}</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {provinceError && <FieldError id={`${provinceSelectId}-error`}>{provinceError}</FieldError>}
      </div>

      <div className={filter ? "relative min-w-48 flex-[1.4]" : ""}>
        {label(localityInputId, "Localidad")}
        {value.locality ? (
          <div className={`flex items-center gap-3 ${filter ? "h-11" : "flex-wrap"}`}>
            <span
              className={`inline-flex items-center rounded-full border-2 border-ink bg-positive-soft font-semibold ${
                filter ? "min-h-9 truncate px-3 text-[15px]" : "min-h-11 px-4"
              }`}
            >
              {filter ? value.locality.displayName : `${value.locality.displayName}, ${province?.name}`}
            </span>
            <button
              type="button"
              onClick={clearLocality}
              className="min-h-11 px-1.5 font-semibold text-primary underline underline-offset-3 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cta"
            >
              Cambiar
            </button>
          </div>
        ) : (
          <>
            <input
              id={localityInputId}
              type="search"
              autoComplete="off"
              className={fieldClass}
              placeholder={
                province ? (filter ? "Todas · escribí para buscar" : "Buscá la localidad") : "Primero elegí una provincia"
              }
              value={query}
              onChange={(e) => changeQuery(e.target.value)}
              disabled={!province}
              aria-invalid={localityError ? true : undefined}
              aria-describedby={`${statusId}${localityError ? ` ${localityInputId}-error` : ""}`}
            />
            {showResults && (
              <ul
                aria-label="Localidades encontradas"
                className={`overflow-hidden rounded-field border-3 border-ink bg-surface ${
                  filter ? "absolute top-full right-0 left-0 z-20 mt-1 max-h-72 overflow-y-auto shadow-card" : "mt-2"
                }`}
              >
                {results.map((locality) => (
                  <li key={locality.id} className="border-b-2 border-disabled last:border-b-0">
                    <button
                      type="button"
                      onClick={() => selectLocality(locality)}
                      className="block min-h-11 w-full px-4 py-2 text-left text-[16px] hover:bg-positive-soft focus-visible:bg-positive-soft focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-cta"
                    >
                      {locality.displayName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div id={statusId} aria-live="polite" className={filter ? "absolute top-full left-0" : ""}>
              {province && text.length > 0 && text.length < MIN_QUERY && help(`Escribí al menos ${MIN_QUERY} letras para buscar.`)}
              {status === "loading" && help("Buscando…")}
              {status === "done" && results.length === 0 && help(`No encontramos localidades con ese nombre en ${province?.name}.`)}
              {status === "done" && results.length > 0 && (
                <span className="sr-only">
                  {results.length === 1 ? "1 localidad encontrada" : `${results.length} localidades encontradas`}
                </span>
              )}
              {status === "error" && (
                <FieldError>No pudimos buscar localidades. Probá de nuevo en unos segundos.</FieldError>
              )}
            </div>
            {localityError && <FieldError id={`${localityInputId}-error`}>{localityError}</FieldError>}
          </>
        )}
      </div>

      <p className={filter ? "order-last basis-full text-xs text-ink-soft" : "text-sm leading-normal text-ink-soft"}>
        Fuente de provincias y localidades: Servicio Georef –{" "}
        <a href="https://www.argentina.gob.ar/georef" className="text-primary underline" target="_blank" rel="noreferrer">
          argentina.gob.ar/georef
        </a>
      </p>
    </div>
  );
}
