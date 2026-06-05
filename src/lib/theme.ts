export const STORAGE_KEY = "theme";

export type ThemeMode = "light" | "dark";

const mediaQuery = "(prefers-color-scheme: dark)";

export function getStoredTheme(): ThemeMode | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

export function getSystemTheme(): ThemeMode {
  return window.matchMedia(mediaQuery).matches ? "dark" : "light";
}

export function getEffectiveTheme(
  stored: ThemeMode | null = getStoredTheme(),
): ThemeMode {
  return stored ?? getSystemTheme();
}

export function applyTheme(effective: ThemeMode): void {
  const root = document.documentElement;
  const stored = getStoredTheme();

  root.classList.toggle("dark", effective === "dark");
  root.classList.toggle("light", effective === "light");
  root.dataset.theme = stored ?? "system";
  root.style.colorScheme = effective;
}

export function setStoredTheme(theme: ThemeMode): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme(): ThemeMode {
  const next = getEffectiveTheme() === "dark" ? "light" : "dark";
  setStoredTheme(next);
  applyTheme(next);
  document.dispatchEvent(new CustomEvent("themechange"));
  return next;
}

let systemListenerAttached = false;

function attachSystemListener(): void {
  if (systemListenerAttached) return;
  systemListenerAttached = true;

  window.matchMedia(mediaQuery).addEventListener("change", (event) => {
    if (getStoredTheme() !== null) return;
    applyTheme(event.matches ? "dark" : "light");
    document.dispatchEvent(new CustomEvent("themechange"));
  });
}

export function initTheme(): ThemeMode {
  const effective = getEffectiveTheme();
  applyTheme(effective);
  attachSystemListener();
  return effective;
}

/** Inline bootstrap for <head> — keep in sync with logic above. */
export const themeInitScript = `(function(){var k='theme',s=localStorage.getItem(k),d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches),r=document.documentElement;r.classList.toggle('dark',d);r.classList.toggle('light',!d);r.dataset.theme=s||'system';r.style.colorScheme=d?'dark':'light';})();`;
