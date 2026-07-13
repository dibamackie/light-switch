export const wallpaperOptions = [
  {
    id: "plain",
    label: "Plain",
    base: "#d9d3c6",
    line: "rgba(80, 74, 66, 0.08)",
    accent: "rgba(255, 250, 238, 0.18)",
    pattern: "grain"
  },
  {
    id: "linen",
    label: "Linen",
    base: "#d6cfbf",
    line: "rgba(77, 68, 58, 0.18)",
    accent: "rgba(255, 251, 240, 0.2)",
    pattern: "vertical"
  },
  {
    id: "grid",
    label: "Grid",
    base: "#d3d0c6",
    line: "rgba(58, 63, 66, 0.16)",
    accent: "rgba(255, 252, 238, 0.14)",
    pattern: "grid"
  },
  {
    id: "arc",
    label: "Arc",
    base: "#d8cbbb",
    line: "rgba(88, 67, 48, 0.18)",
    accent: "rgba(250, 238, 216, 0.22)",
    pattern: "arc"
  }
];

export const chairColorOptions = [
  { id: "cream", label: "Cream", color: "#e8dfcf" },
  { id: "rust", label: "Rust", color: "#a75d45" },
  { id: "charcoal", label: "Charcoal", color: "#292928" },
  { id: "olive", label: "Olive green", color: "#69745b" }
];

export function getWallpaper(id) {
  return wallpaperOptions.find((option) => option.id === id) || wallpaperOptions[0];
}

export function getChairColor(id) {
  return chairColorOptions.find((option) => option.id === id) || chairColorOptions[0];
}
