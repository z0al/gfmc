import * as t from './tokens'

// We can divide blocks into two types: container blocks, which can contain
// other blocks, and leaf blocks, which cannot.
//
// ref: https://github.github.com/gfm/#container-blocks-and-leaf-blocks
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
  atx_heading: /^(?: {0,3})([#]{1,6})(?: (.*))?(?:\n|$)/,

  // A line consisting of 0-3 spaces of indentation, followed by a sequence of
  // three or more matching -, _, or * characters, each followed optionally by
  // any number of spaces. It is required that all of the non-whitespace
  // characters be the same. Spaces are allowed at the end. However, no other
  // characters may occur in the line
  //
  // ref: https://github.github.com/gfm/#thematic-breaks
  thematic_break: /^(?: {0,3})([-*_]) *(?:\1 *){2,}(?:\n|$)/
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

      // Blank lines
      match = rules.atx_heading.exec(this.src)
      if (match) {
        this.eat(match)
        // Level? 1-6
        const level = match[1].length
        // Text?
        let text = (match[2] || '').trim()

        // Has closing sequence?
        const closed = text.match(/( [#]+)$/)
        if (closed) {
          text = text.replace(closed[0], '')
        } else if (text.split('').every(e => e === '#')) {
          // If the text is pure #s then it's probably something like this:
          //
          // ## ###
          //
          // In which case we have no text
          text = ''
        }

        this.tokens.push({
          level,
          text: text.trim(),
          type: 'atx_heading'
        } as t.ATXHeading)

        continue
      }

      // Thematic break
      match = rules.thematic_break.exec(this.src)
      if (match) {
        this.eat(match)

        this.tokens.push({
          char: match[1],
          type: 'thematic_break'
        } as t.ThematicBreak)

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
