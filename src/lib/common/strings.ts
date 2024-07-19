export const eclipseConcat = (s: string[]) => {
  let finalString = s.join("... ");

  if (finalString[0] !== finalString[0].toUpperCase())
    finalString = "..." + finalString;

  if (![".", "?", "!"].includes(finalString)) finalString += "...";

  return finalString;
};

export const valEmail = (s: string) => !!s.match("[^@]+@[^@]+\\.[^@]+");

export const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: (amount | 0) < amount ? 2 : 0, // Remove trailing zeroes if present
  }).format(amount);
