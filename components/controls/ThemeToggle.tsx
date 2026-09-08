"use client";

const STORAGE_KEY = "marie.dev.theme";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";

    root.dataset.theme = nextTheme;
    localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  return (
    <button
      type="button"
      className="editorial-control"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
    >
      <span className="theme-current-light">(light)</span>
      <span className="theme-current-dark">(dark)</span>
    </button>
  );
}
