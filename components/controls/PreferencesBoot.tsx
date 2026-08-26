"use client";

import { useEffect } from "react";

const THEME_KEY = "marie.dev.theme";
const LANGUAGE_KEY = "marie.dev.language";

export function PreferencesBoot() {
  useEffect(() => {
    try {
      const root = document.documentElement;

      const storedTheme =
        localStorage.getItem(THEME_KEY);

      const storedLanguage =
        localStorage.getItem(LANGUAGE_KEY);

      const theme =
        storedTheme === "light"
          ? "light"
          : "dark";

      const language =
        storedLanguage === "fr"
          ? "fr"
          : "en";

      root.dataset.theme = theme;
      root.dataset.language = language;
      root.lang = language;
    } catch {
      // Keep the defaults from the server-rendered HTML.
    }
  }, []);

  return null;
}