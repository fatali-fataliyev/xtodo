import { monthNames } from "../../constants/monthNames";

const separator = " • ";

export function remindAtParseDate(
  dateInput: string | Date | undefined | null,
  hourFormat: number = 12,
  onlyDate: boolean,
): string {
  const date = resolveDate(dateInput);
  if (!date) return "";

  const now = new Date();
  let is12HourFormat: boolean = hourFormat === 12;

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: is12HourFormat,
  });

  const day = date.getDate();
  const monthName = date.toLocaleString("default", { month: "long" });
  const yearShort = String(date.getFullYear()).slice(-2);

  const isThisYear = date.getFullYear() === now.getFullYear();

  let dateText: string;

  if (isThisYear) {
    dateText = `${day} ${monthName}`;
  } else {
    dateText = `${day} ${monthName}/${yearShort}`;
  }

  if (onlyDate) {
    return `${dateText}`;
  }

  return `${timeStr}`;
}

export function resolveDate(
  date: string | Date | undefined | null,
): Date | null {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}
