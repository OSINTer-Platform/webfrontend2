export const eclipseConcat = (s: string[]) => {
  let finalString = s.join("... ");

  if (finalString[0] !== finalString[0].toUpperCase())
    finalString = "..." + finalString;

  if ([".", "?", "!"].includes(finalString)) finalString += "...";

  return finalString;
};
