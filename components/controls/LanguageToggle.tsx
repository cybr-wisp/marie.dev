"use client";

const STORAGE_KEY = "marie.dev.language";

export function LanguageToggle() {
  function toggleLanguage() {
    const root = document.documentElement;

    const nextLanguage =
      root.dataset.language === "fr"
        ? "en"
        : "fr";

    root.dataset.language = nextLanguage;
    root.lang = nextLanguage;

    localStorage.setItem(
      STORAGE_KEY,
      nextLanguage,
    );
  }

  return (
    <button
      type="button"
      className="mode-button"
      onClick={toggleLanguage}
      aria-label="Toggle site language"
    >
      <span className="language-switch-to-fr">
        FR
      </span>

      <span className="language-switch-to-en">
        EN
      </span>
    </button>
  );
}