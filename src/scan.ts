import { ThematicBreak, Token } from './tokens'

// We can divide blocks into two types: container blocks, which can contain
// other blocks, and leaf blocks, which cannot.
//
// ref: https://github.github.com/gfm/#container-blocks-and-leaf-blocks
const rules = {
  // ========================================================================
  // >     LEAF BLOCKS                                                      <
  // ========================================================================

  // A line consisting of 0-3 spaces of indentation, followed by a sequence
  // of three or more matching -, _, or * characters, each followed optionally
  // by any number of spaces. It is required that all of the non-whitespace
  // characters be the same. Spaces are allowed at the end. However, no other
  // characters may occur in the line
  //
  // ref: https://github.github.com/gfm/#thematic-breaks
  thematic_break: /^(?: {0,3})([-*_]) *(?:\1 *){2,}(?:\n+|$)/
}

export class BlockScanner {
  private tokens: Token[] = []
  private src: string

  constructor(src: string) {
    // For security reasons, the Unicode character U+0000 must be
    // replaced with the REPLACEMENT CHARACTER (U+FFFD).
    //
    // ref: https://github.github.com/gfm/#insecure-characters
    this.src = src.replace('\u0000', '\uFFFD')

    // A line ending is a newline (U+000A), a carriage return (U+000D)
    // not followed by a newline, or a carriage return and a following
    // newline.
    this.src = this.src.replace(/\r\n|\r/g, '\n')
  }

  public scan(): Token[] {
    while (this.src) {
      let match: RegExpExecArray

      // Thematic break
      match = rules.thematic_break.exec(this.src)
      if (match) {
        this.eat(match)

        this.tokens.push({
          char: match[1],
          type: 'thematic_break'
        } as ThematicBreak)

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
