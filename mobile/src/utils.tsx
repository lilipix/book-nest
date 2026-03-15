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

export function getBookColor(title: string) {
  const index = title.length % colors.length;
  return colors[index];
}
