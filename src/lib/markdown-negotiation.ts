/**
 * Content negotiation helpers for serving text/markdown to AI agents
 * per https://acceptmarkdown.com — parses the Accept header's q-values
 * instead of doing a plain substring match, so a browser's
 * an Accept header ending in a wildcard (e.g. text/html,...,q=0.8) never gets markdown.
 */

type MediaRange = { type: string; q: number };

function parseAccept(header: string): MediaRange[] {
  return header
    .split(",")
    .map((part) => {
      const [type, ...params] = part.trim().split(";").map((s) => s.trim());
      const qParam = params.find((p) => p.startsWith("q="));
      const q = qParam ? parseFloat(qParam.slice(2)) : 1;
      return { type: type.toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .filter((r) => r.type.length > 0);
}

function qFor(ranges: MediaRange[], mime: string): number {
  const exact = ranges.find((r) => r.type === mime);
  if (exact) return exact.q;
  const subtypeWildcard = ranges.find((r) => r.type === `${mime.split("/")[0]}/*`);
  if (subtypeWildcard) return subtypeWildcard.q;
  const anyWildcard = ranges.find((r) => r.type === "*/*");
  if (anyWildcard) return anyWildcard.q;
  return 0;
}

/**
 * True when the client explicitly listed text/markdown (or text/*) in its
 * Accept header, at a q at least as high as text/html. A bare wildcard (curl's
 * default, and most non-browser clients that don't send Accept at all after
 * curl fills it in) must NOT count as "asked for markdown" — only html's
 * side of the comparison falls back to the wildcard.
 */
export function prefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;
  const ranges = parseAccept(acceptHeader);
  const markdownEntry = ranges.find((r) => r.type === "text/markdown" || r.type === "text/*");
  if (!markdownEntry || markdownEntry.q <= 0) return false;
  const htmlQ = qFor(ranges, "text/html");
  return markdownEntry.q >= htmlQ;
}

export const MARKDOWN_VARY_FIELDS = "Accept, Accept-Encoding";

/** Merges Accept/Accept-Encoding into an existing Vary header without duplicating tokens. */
export function withMarkdownVary(existingVary: string | null): string {
  const tokens = (existingVary ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  for (const field of ["Accept", "Accept-Encoding"]) {
    if (!tokens.some((t) => t.toLowerCase() === field.toLowerCase())) tokens.push(field);
  }
  return tokens.join(", ");
}
