import { LanguageToggle } from "@/components/controls/LanguageToggle";
import { ThemeToggle } from "@/components/controls/ThemeToggle";

export function Header() {
  return (
    <header className="index-controls">
      <LanguageToggle />
      <ThemeToggle />
    </header>
  );
}