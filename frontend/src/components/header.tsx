import { ModeToggle } from "./ui/mode-toggle";
import { races2025 } from "@/lib/mock-data";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className="font-bold px-3 py-2 rounded-md transition-all duration-200 hover:text-foreground hover:bg-accent/50"
              >
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-3 py-2 text-foreground/60">
                2025
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-56 p-1">
                  {races2025.map((race) => (
                    <NavigationMenuLink
                      key={race.id}
                      href={`#${race.id}`}
                      className={`w-full flex flex-row justify-start items-center text-left px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${
                        race.latestRace
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      {race.name}
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>
    </header>
  );
}
