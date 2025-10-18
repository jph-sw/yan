import { useContext } from "react";
import { ThemeContext } from "@/components/theme-provider";

export const useTheme = () => {
  const val = useContext(ThemeContext);
  if (!val) throw new Error("useTheme called outside of ThemeProvider!");
  return val;
};
