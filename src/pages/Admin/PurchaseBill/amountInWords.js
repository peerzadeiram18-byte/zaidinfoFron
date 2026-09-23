// ==========================================================
// AMOUNT IN WORDS (Indian numbering system)
//
// 23200      -> "INR Twenty Three Thousand Two Hundred Only"
// 3538.98    -> "INR Three Thousand Five Hundred Thirty Eight
//                and Ninety Eight paise Only"
//
// Indian system groups digits as: ...,XX,XX,XXX
// (Crore, Lakh, Thousand, Hundred) — not the international
// 3-digit grouping.
// ==========================================================

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
  "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
  "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
  "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty",
  "Seventy", "Eighty", "Ninety",
];


// ----------------------------------------------------------
// Convert a number from 0 to 999 into words
// ----------------------------------------------------------

function threeDigitsToWords(number) {

  let result = "";

  if (number >= 100) {
    result += `${ONES[Math.floor(number / 100)]} Hundred `;
    number %= 100;
  }

  if (number >= 20) {
    result += `${TENS[Math.floor(number / 10)]} `;
    number %= 10;
  }

  if (number > 0) {
    result += `${ONES[number]} `;
  }

  return result.trim();
}


// ----------------------------------------------------------
// Convert the whole-rupee part into words using the Indian
// Crore / Lakh / Thousand / Hundred grouping
// ----------------------------------------------------------

function wholeNumberToWords(number) {

  if (number === 0) {
    return "Zero";
  }

  const crore = Math.floor(number / 10000000);
  number %= 10000000;

  const lakh = Math.floor(number / 100000);
  number %= 100000;

  const thousand = Math.floor(number / 1000);
  number %= 1000;

  const hundred = number;

  const parts = [];

  if (crore > 0) {
    parts.push(`${threeDigitsToWords(crore)} Crore`);
  }

  if (lakh > 0) {
    parts.push(`${threeDigitsToWords(lakh)} Lakh`);
  }

  if (thousand > 0) {
    parts.push(`${threeDigitsToWords(thousand)} Thousand`);
  }

  if (hundred > 0) {
    parts.push(threeDigitsToWords(hundred));
  }

  return parts.join(" ").trim();
}


// ----------------------------------------------------------
// PUBLIC: amountInWords(amount)
// ----------------------------------------------------------

export function amountInWords(amount) {

  const value = Number(amount) || 0;

  const isNegative = value < 0;

  const absoluteValue = Math.abs(value);

  // round to 2 decimal places to avoid floating point noise
  const rounded = Math.round(absoluteValue * 100) / 100;

  const rupees = Math.floor(rounded);

  const paise = Math.round((rounded - rupees) * 100);

  let words = `INR ${wholeNumberToWords(rupees)}`;

  if (paise > 0) {
    words += ` and ${threeDigitsToWords(paise)} paise`;
  }

  words += " Only";

  if (isNegative) {
    words = `Minus ${words}`;
  }

  return words;
}