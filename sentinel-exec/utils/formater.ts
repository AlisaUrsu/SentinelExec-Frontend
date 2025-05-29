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
  const units = ["bytes", "KB", "MB", "GB", "TB"];
  let i = 0;

  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(2)} ${units[i]}`;
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
