import { marked } from "marked";

export type HeadingList = Array<{
  text: string;
  id: string;
  depth: number;
}>;

function extractTitleText(token: marked.Token): string {
  if (token.type == "text" || ("tokens" in token && token.tokens.length < 1)) {
    return token.raw ?? token.text;
  } else {
    if ("tokens" in token && token.tokens.length > 0)
      return extractTitleText(token.tokens[0]);
    return "";
  }
}

function generateHeaderID(text: string): string {
  text = text
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  return text;
}

export function MDtoToC(tokens: marked.Token[]): HeadingList {
  let lowestDepth: number = 6;
  const list: HeadingList = [];

  for (const token of tokens) {
    if (token.type == "heading") {
      const titleText = extractTitleText(token);

      list.push({
        text: titleText,
        id: generateHeaderID(titleText),
        depth: token.depth,
      });

      if (token.depth < lowestDepth) {
        lowestDepth = token.depth;
      }
    }
  }

  for (const heading of list) {
    heading.depth = heading.depth - lowestDepth;
  }

  return list;
}
