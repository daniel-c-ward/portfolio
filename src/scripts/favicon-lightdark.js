function updateFavicon() {
  const isDark = document.documentElement.classList.contains("dark");
  const light = document.getElementById("favicon-light");
  const dark = document.getElementById("favicon-dark");

  if (!light || !dark) return;

  if (isDark) {
    light.rel = "alternate icon";
    dark.rel = "icon";
  } else {
    light.rel = "icon";
    dark.rel = "alternate icon";
  }
}

// Initialize favicon immediately (don't wait for DOMContentLoaded)
updateFavicon();

// Update favicon when theme changes
document.addEventListener("themechange", updateFavicon);
