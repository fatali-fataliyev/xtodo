import { remindAtParseDate } from "@/components/todos/RemindAtDateParser";

describe("Date Parser Reminder (Modal)", () => {
  it("24-Hour formatted date test - TODAY", () => {
    const input = new Date("2026-08-17T18:30:00+04:00");
    const expected = "18:30";
    const result = remindAtParseDate(input, 24, false);
    expect(result).toBe(expected);
  });
});

describe("Date Parser Reminder (Modal)", () => {
  it("12-Hour formatted date test - TODAY", () => {
    const input = new Date("2026-08-17T18:30:00+04:00");
    const expected = "6:30 PM";
    const result = remindAtParseDate(input, 12, false);
    expect(result).toBe(expected);
  });
});

describe("Date Parser Reminder (Modal)", () => {
  it("Only date - Current Year", () => {
    const input = new Date("2026-08-17T18:30:00+04:00");
    const expected = "17 August";
    const result = remindAtParseDate(input, 24, true);
    expect(result).toBe(expected);
  });
});

describe("Date Parser Reminder (Modal)", () => {
  it("Only date - Next Year", () => {
    const input = new Date("2027-08-17T18:30:00+04:00");
    const expected = "17 August/27";
    const result = remindAtParseDate(input, 24, true);
    expect(result).toBe(expected);
  });
});
