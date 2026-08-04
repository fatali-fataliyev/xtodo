import { useSettingsStore } from "@/store/useSettingsStore";
import { monthNames } from "../constants/monthNames";

const separator = " • ";

export function parseDate(dateInput: string | Date | undefined | null): string {
  let dateFormat = useSettingsStore((state) => state.hourFormat);

  const date = resolveDate(dateInput);
  if (!date) return "";

  let is12HourFormat: boolean = dateFormat === 12;

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: is12HourFormat,
  });

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffInDays = Math.round(
    (startOfTarget.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) {
    return timeStr;
  }

  if (diffInDays === 1) {
    return `${timeStr}${separator}Tomorrow`;
  }

  if (diffInDays === -1) {
    return `${timeStr}${separator}Yesterday`;
  }

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const yearShort = String(date.getFullYear()).slice(-2);

  const isThisYear = date.getFullYear() === now.getFullYear();

  if (isThisYear) {
    const monthText = monthNames[monthIndex];
    const dateText = `${day} ${monthText}`;
    return `${timeStr}${separator}${dateText}`;
  }

  return `${timeStr}${separator} ${monthIndex + 1}/${yearShort}`;
}

export function resolveDate(
  date: string | Date | undefined | null,
): Date | null {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}
