export const Colors = {
  high: "#E53935",
  medium: "#FFD166",
  low: "#06D6A0",
};

export function GetColorByLevel(level) {
  switch (level) {
    case "high":
      return Colors.high;
    case "medium":
      return Colors.medium;
    case "low":
      return Colors.low;
  }
  return "";
}
