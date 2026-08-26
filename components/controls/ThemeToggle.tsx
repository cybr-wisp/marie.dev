"use client";

const STORAGE_KEY = "marie.dev.theme";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;

    const nextTheme =
      root.dataset.theme === "light"
        ? "dark"
        : "light";

    root.dataset.theme = nextTheme;

    localStorage.setItem(
      STORAGE_KEY,
      nextTheme,
    );
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle light / dark theme"
    >
      <span
        className="theme-toggle__option theme-toggle__sun"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.5V5" />
          <path d="M12 19V21.5" />
          <path d="M2.5 12H5" />
          <path d="M19 12H21.5" />
          <path d="M5.3 5.3L7.1 7.1" />
          <path d="M16.9 16.9L18.7 18.7" />
          <path d="M18.7 5.3L16.9 7.1" />
          <path d="M7.1 16.9L5.3 18.7" />
        </svg>
      </span>

      <span
        className="theme-toggle__option theme-toggle__moon"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24">
          <path d="M19.2 15.3A7.8 7.8 0 0 1 8.7 4.8 8.2 8.2 0 1 0 19.2 15.3Z" />
        </svg>
      </span>
    </button>
  );
}
