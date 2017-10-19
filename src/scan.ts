import * as t from './tokens'

// We can think of a document as a sequence of blocks—structural elements like
// paragraphs, block quotations, lists, headings, rules, and code blocks. Some
// blocks (like block quotes and list items) contain other blocks; others (like
// headings and paragraphs) contain inline content—text, links, emphasized
// text, images, code spans, and so on.
//
// ref: https://github.github.com/gfm/#blocks-and-inlines
const rules = {
  // ========================================================================
  // >     LEAF BLOCKS                                                      <
  // ========================================================================

  // An ATX heading consists of a string of characters, parsed as inline
  // content, between an opening sequence of 1–6 unescaped # characters and an
  // optional closing sequence of any number of unescaped # characters. The
  // opening sequence of # characters must be followed by a space or by the end
  // of line. The optional closing sequence of #s must be preceded by a space
  // and may be followed by spaces only. The opening # character may be
  // indented 0-3 spaces.
  //
  // ref: https://github.github.com/gfm/#atx-heading
  atx_heading: /^(?: {0,3})([#]{1,6})(?:(?:(?: (.*))?( #{0,}))|(?: (.*))?)(?=\n|$)/,

  // A setext heading consists of one or more lines of text, each containing at
  // least one non-whitespace character, with no more than 3 spaces indentation
  // followed by a setext heading underline. The lines of text must be such
  // that were they not followed by the setext heading underline, they would be
  // interpreted as a paragraph: they cannot be interpretable as a code fence,
  // ATX heading, block quote, thematic break, list item, or HTML block.
  //
  // ref: https://github.github.com/gfm/#setext-heading
  setext_heading: /^((?:(?: {0,3})(?:(?![\*\-\+] |\d+(?:\)|\.) |\s)[^\n]*)\n)+)(?: {0,3})(-{2,}|=+) *(?=\n|$)/,

  // A line consisting of 0-3 spaces of indentation, followed by a sequence of
  // three or more matching -, _, or * characters, each followed optionally by
  // any number of spaces. It is required that all of the non-whitespace
  // characters be the same. Spaces are allowed at the end. However, no other
  // characters may occur in the line
  //
  // ref: https://github.github.com/gfm/#thematic-breaks
  thematic_break: /^(?: {0,3})([-*_]) *(?:\1 *){2,}(?=\n|$)/
}

export class BlockScanner {
  private tokens: t.Token[] = []
  private src: string

  constructor(src: string) {
    // For security reasons, the Unicode character U+0000 must be replaced with
    // the REPLACEMENT CHARACTER (U+FFFD).
    //
    // ref: https://github.github.com/gfm/#insecure-characters
    this.src = src.replace(/\0/g, '\uFFFD')

    // A line ending is a newline (U+000A), a carriage return (U+000D) not
    // followed by a newline, or a carriage return and a following newline.
    this.src = this.src.replace(/\r\n|\r/g, '\n')
  }

  public scan(): t.Token[] {
    while (this.src) {
      let match: RegExpExecArray

      // New line
      match = /^\n+/.exec(this.src)
      if (match) {
        this.tokens.push({
          type: 'newline'
        })

        this.eat(match)
        continue
      }

      // Thematic break
      match = rules.thematic_break.exec(this.src)
      if (match) {
        this.tokens.push({
          char: match[1],
          type: 'thematic_break'
        } as t.ThematicBreak)

        this.eat(match)
        continue
      }

      // ATX heading
      match = rules.atx_heading.exec(this.src)
      if (match) {
        // Level? 1-6
        const level = match[1].length
        // Text?
        let text = (match[2] || match[4] || '').trim()

        // Our regex fail in cases when there are spaces after the optional
        // closing sequence, let's check if it's the case?
        const closed = text.match(/( [#]+)$/)
        if (closed) {
          text = text.replace(closed[0], '').trim()
        }

        this.tokens.push({
          level,
          text,
          type: 'atx_heading'
        } as t.ATXHeading)

        this.eat(match)
        continue
      }

      // Setext heading
      match = rules.setext_heading.exec(this.src)
      if (match) {
        this.tokens.push({
          level: match[2][0] === '=' ? 1 : 2,
          text: match[1].trim(),
          type: 'setext_heading'
        } as t.SetextHeading)

        this.eat(match)
        continue
      }

      // Error?
      // if (this.src) {
      //   throw new Error('Infinite loop on byte: ' + this.src.charCodeAt(0))
      // }
      break
    }
    return this.tokens
  }

  /**
   * Advances the source string position by eating the matched text
   *
   * @param {RegExpExecArray} match
   * @private
   */
  private eat(match: RegExpExecArray) {
    this.src = this.src.substring(match[0].length)
  }
}
