import { IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card hover:bg-accent transition-colors"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <IconSun className="h-4 w-4 text-foreground" />
      ) : (
        <IconMoon className="h-4 w-4 text-foreground" />
      )}
    </button>
  )
}
