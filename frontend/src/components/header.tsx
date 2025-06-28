import { ModeToggle } from "./ui/mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-2xl items-center px-4">
        <nav className="flex w-full items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="font-bold transition-colors hover:text-foreground/80"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              2025
            </a>
          </div>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
