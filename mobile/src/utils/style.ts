const colors = [
  "#4A6FA5",
  "#8E6C8A",
  "#6B8E23",
  "#C06C84",
  "#355C7D",
  "#F67280",
  "#99B898",
  "#F8B195",
];

// const fallbackColors = [
//   "#D7EAD8",
//   "#EFD3C5",
//   "#D9E6F2",
//   "#E8D9F1",
//   "#F2D6DC",
//   "#DCEAD7",
// ];
const fallbackColors = [
  "#DCE7D9", // vert sauge clair
  "#E8DAD1", // beige rosé
  "#DDE6ED", // bleu gris clair
  "#E6DFF1", // violet très doux
  "#F1DDE4", // rose poudré
  "#E3EAD7", // vert olive très clair
];

export function getBookColor(title: string) {
  const index = title.length % fallbackColors.length;
  return fallbackColors[index];
}
