// General Token interface
export interface Token {
  type: string
}

// A line consisting of 0-3 spaces of indentation, followed by a sequence of
// three or more matching -, _, or * characters, each followed optionally by
// any number of spaces. It is required that all of the non-whitespace
// characters be the same. Spaces are allowed at the end. However, no other
// characters may occur in the line
//
// ref: https://github.github.com/gfm/#thematic-breaks
export interface ThematicBreak extends Token {
  char: string
}

// An ATX heading consists of a string of characters, parsed as inline
// content, between an opening sequence of 1–6 unescaped # characters and an
// optional closing sequence of any number of unescaped # characters. The
// opening sequence of # characters must be followed by a space or by the end
// of line. The optional closing sequence of #s must be preceded by a space
// and may be followed by spaces only. The opening # character may be
// indented 0-3 spaces.
//
// A setext heading consists of one or more lines of text, each containing at
// least one non-whitespace character, with no more than 3 spaces indentation
// followed by a setext heading underline. The lines of text must be such
// that were they not followed by the setext heading underline, they would be
// interpreted as a paragraph: they cannot be interpretable as a code fence,
// ATX heading, block quote, thematic break, list item, or HTML block.
//
// ref: https://github.github.com/gfm/#atx-heading
// ref: https://github.github.com/gfm/#setext-heading
export interface Heading extends Token {
  text: string
  level: number
  atx: boolean
}
