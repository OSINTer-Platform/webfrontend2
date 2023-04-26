import type SvelteMarkdown from 'svelte-markdown';

export type ParsedEvent = SvelteMarkdown['$$events_def']['parsed'];
type TokensList = ParsedEvent['detail']['tokens'];

type UnpackTokenList<L> = L extends (infer T)[] ? T : L;
type Token = UnpackTokenList<TokensList>;

export type HeadingList = Array<{
    text: string;
    id: string;
    depth: number;
}>;

function extractTitleText(token: Token): string {
    if (
        token.type == 'text' ||
        !(Array.isArray(token.tokens) && token.tokens.length > 0)
    ) {
        return token.text ?? token.raw;
    } else {
        return extractTitleText(token.tokens[0]);
    }
}

function generateHeaderID(text: string): string {
    return text
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/[^a-zA-Z0-9_-]/g, '');
}

export function MDtoToC(e: ParsedEvent): HeadingList {
    let lowestDepth: number = 6;
    const list: HeadingList = [];

    for (const token of e.detail.tokens) {
        if (token.type == 'heading') {
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
