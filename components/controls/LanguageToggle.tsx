"use client";

const STORAGE_KEY = "marie.dev.language";

export function LanguageToggle() {
  function toggleLanguage() {
    const root = document.documentElement;
    const nextLanguage = root.dataset.language === "fr" ? "en" : "fr";

    root.dataset.language = nextLanguage;
    root.lang = nextLanguage;
    localStorage.setItem(STORAGE_KEY, nextLanguage);
  }

  return (
    <button
      type="button"
      className="editorial-control"
      onClick={toggleLanguage}
      aria-label="Toggle site language"
    >
      <span className="language-current-en">(en)</span>
      <span className="language-current-fr">(fr)</span>
    </button>
  );
}
