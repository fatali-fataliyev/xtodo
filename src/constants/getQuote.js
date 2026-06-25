const Quotes = [
  "Check one off.",
  "Nothing done yet.",
  "Finish one task.",
  "Pick a task.",
  "Take action.",
  "Build momentum.",
  "You look nice today :)",
  "¯\\_(ツ)_/¯",
  "Action is life.",
];

export default () => ({
  quote: Quotes[Math.floor(Math.random() * Quotes.length)],
});
