"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchLocalitiesAction } from "@/actions/location";
import { Locality } from "@/lib/api/models/locality/locality";
import { Province } from "@/lib/api/models/locality/province";
import { FieldError, FieldHelp, Label, inputClass } from "./ui/form-field";

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
 */
export default function LocationSelector({
  provinces,
  value,
  onChange,
  provinceError,
  localityError,
  optional = false,
}: {
  provinces: Province[];
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  provinceError?: string;
  localityError?: string;
  /** Para filtros: la provincia ofrece «Todas» y los campos van en fila en pantallas anchas. */
  optional?: boolean;
}) {
  const id = useId();
  const provinceSelectId = `${id}-province`;
  const localityInputId = `${id}-locality`;
  const statusId = `${id}-status`;

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

  return (
    <div className={optional ? "grid gap-4 md:grid-cols-2" : "flex flex-col gap-6"}>
      <div>
        <Label htmlFor={provinceSelectId}>Provincia</Label>
        <select
          id={provinceSelectId}
          className={inputClass}
          value={value.provinceId ?? ""}
          onChange={(e) => selectProvince(e.target.value)}
          aria-invalid={provinceError ? true : undefined}
          aria-describedby={provinceError ? `${provinceSelectId}-error` : undefined}
        >
          <option value="">{optional ? "Todas" : "Elegí una provincia"}</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {provinceError && <FieldError id={`${provinceSelectId}-error`}>{provinceError}</FieldError>}
      </div>

      <div>
        <Label htmlFor={localityInputId}>Localidad</Label>
        {value.locality ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex min-h-11 items-center rounded-full border-2 border-ink bg-positive-soft px-4 font-semibold">
              {value.locality.displayName}, {province?.name}
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
              className={inputClass}
              placeholder={province ? (optional ? "Todas (buscá para elegir una)" : "Buscá la localidad") : "Primero elegí una provincia"}
              value={query}
              onChange={(e) => changeQuery(e.target.value)}
              disabled={!province}
              aria-invalid={localityError ? true : undefined}
              aria-describedby={`${statusId}${localityError ? ` ${localityInputId}-error` : ""}`}
            />
            {showResults && (
              <ul
                aria-label="Localidades encontradas"
                className="mt-2 overflow-hidden rounded-field border-3 border-ink bg-surface"
              >
                {results.map((locality) => (
                  <li key={locality.id} className="border-b-2 border-disabled last:border-b-0">
                    <button
                      type="button"
                      onClick={() => selectLocality(locality)}
                      className="block min-h-12 w-full px-4 py-2.5 text-left text-[17px] hover:bg-positive-soft focus-visible:bg-positive-soft focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-cta"
                    >
                      {locality.displayName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div id={statusId} aria-live="polite">
              {province && text.length > 0 && text.length < MIN_QUERY && (
                <FieldHelp>Escribí al menos {MIN_QUERY} letras para buscar.</FieldHelp>
              )}
              {status === "loading" && <FieldHelp>Buscando…</FieldHelp>}
              {status === "done" && results.length === 0 && (
                <FieldHelp>No encontramos localidades con ese nombre en {province?.name}.</FieldHelp>
              )}
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

      <p className={`text-sm leading-normal text-ink-soft ${optional ? "md:col-span-2" : ""}`}>
        Fuente de provincias y localidades: Servicio Georef –{" "}
        <a href="https://www.argentina.gob.ar/georef" className="text-primary underline" target="_blank" rel="noreferrer">
          argentina.gob.ar/georef
        </a>
      </p>
    </div>
  );
}
