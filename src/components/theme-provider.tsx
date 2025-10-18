import { useRouter } from "@tanstack/react-router";
import { createContext, type PropsWithChildren, useContext } from "react";
import { setThemeServerFn, type T as Theme } from "@/utils/theme";

type ThemeContextVal = { theme: Theme; setTheme: (val: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

export const ThemeContext = createContext<ThemeContextVal | null>(null);

export function ThemeProvider({ children, theme }: Props) {
  const router = useRouter();

  function setTheme(val: Theme) {
    setThemeServerFn({ data: val }).then(() => router.invalidate());
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}
