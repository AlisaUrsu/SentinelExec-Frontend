import { format, parseISO, isValid } from "date-fns";

export function formatReadableDate(
  isoDate: string | null | undefined,
  fallback: string = "-"
): string {
  if (!isoDate) return fallback;

  const date = parseISO(isoDate);
  return isValid(date) ? format(date, "MMMM do, yyyy") : fallback;
}

export function formatFileSize(bytes: number): string {
  return Intl.NumberFormat("en-US", {
    style: "unit",
    unit: "byte",
    notation: "compact",
  }).format(bytes);
}

export function formatReadableDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
