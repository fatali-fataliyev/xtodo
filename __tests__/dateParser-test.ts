import { parseDate } from "@/utils/dateParser";

describe("Date Parser General", () => {
  it("24-Hour formatted date test - TODAY", () => {
    const input = new Date("2026-08-17T18:30:00+04:00");
    const expected = "18:30";
    const result = parseDate(input, 24);
    expect(result).toBe(expected);
  });
});

describe("Date Parser General", () => {
  it("12-Hour formatted date test - TODAY", () => {
    const input = new Date("2026-08-17T18:30:00+04:00");
    const expected = "6:30 PM";
    const result = parseDate(input, 12);
    expect(result).toBe(expected);
  });
});

describe("Date Parser General", () => {
  it("24-Hour formatted date test - TOMORROW", () => {
    const input = new Date("2026-08-18T18:30:00+04:00");
    const expected = "18:30 • Tomorrow";
    const result = parseDate(input, 24);
    expect(result).toBe(expected);
  });
});

describe("Date Parser General", () => {
  it("12-Hour formatted date test - TOMORROW", () => {
    const input = new Date("2026-08-18T18:30:00+04:00");
    const expected = "6:30 PM • Tomorrow";
    const result = parseDate(input, 12);
    expect(result).toBe(expected);
  });
});

describe("Date Parser General", () => {
  it("24-Hour formatted date test - YESTERDAY", () => {
    const input = new Date("2026-08-16T18:30:00+04:00");
    const expected = "18:30 • Yesterday";
    const result = parseDate(input, 24);
    expect(result).toBe(expected);
  });
});

describe("Date Parser General", () => {
  it("12-Hour formatted date test - YESTERDAY", () => {
    const input = new Date("2026-08-16T18:30:00+04:00");
    const expected = "6:30 PM • Yesterday";
    const result = parseDate(input, 12);
    expect(result).toBe(expected);
  });
});

describe("Date Parser General", () => {
  it("24-Hour formatted date test - 2 MONTH AGO", () => {
    const input = new Date("2026-06-16T18:30:00+04:00");
    const expected = "18:30 • 16 Jun";
    const result = parseDate(input, 24);
    expect(result).toBe(expected);
  });
});


describe("Date Parser General", () => {
  it("12-Hour formatted date test - 2 MONTH AGO", () => {
    const input = new Date("2026-06-16T18:30:00+04:00");
    const expected = "6:30 PM • 16 Jun";
    const result = parseDate(input, 12);
    expect(result).toBe(expected);
  });
});


describe("Date Parser General", () => {
  it("24-Hour formatted date test - IN 2 MONTH ", () => {
    const input = new Date("2026-10-16T18:30:00+04:00");
    const expected = "18:30 • 16 Oct";
    const result = parseDate(input, 24);
    expect(result).toBe(expected);
  });
});


describe("Date Parser General", () => {
  it("12-Hour formatted date test - IN 2 MONTH ", () => {
    const input = new Date("2026-10-16T18:30:00+04:00");
    const expected = "6:30 PM • 16 Oct";
    const result = parseDate(input, 12);
    expect(result).toBe(expected);
  });
});


describe("Date Parser General", () => {
  it("24-Hour formatted date test - LAST YEAR ", () => {
    const input = new Date("2025-10-16T18:30:00+04:00");
    const expected = "18:30 • 10/25";
    const result = parseDate(input, 24);
    expect(result).toBe(expected);
  });
});

describe("Date Parser General", () => {
  it("12-Hour formatted date test - LAST YEAR ", () => {
    const input = new Date("2025-10-16T18:30:00+04:00");
    const expected = "6:30 PM • 10/25";
    const result = parseDate(input, 12);
    expect(result).toBe(expected);
  });
});


describe("Date Parser General", () => {
  it("24-Hour formatted date test - NEXT YEAR ", () => {
    const input = new Date("2027-10-16T18:30:00+04:00");
    const expected = "18:30 • 10/27";
    const result = parseDate(input, 24);
    expect(result).toBe(expected);
  });
});

describe("Date Parser General", () => {
  it("12-Hour formatted date test - NEXT YEAR ", () => {
    const input = new Date("2027-10-16T18:30:00+04:00");
    const expected = "6:30 PM • 10/27";
    const result = parseDate(input, 12);
    expect(result).toBe(expected);
  });
});
