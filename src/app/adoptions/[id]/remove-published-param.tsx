"use client";

import { useEffect } from "react";

export default function RemovePublishedParam() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("published")) return;
    url.searchParams.delete("published");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  return null;
}
