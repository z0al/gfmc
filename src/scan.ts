import * as t from './tokens'

// Helpers
const indent = /^( {4,})\S/
const spaces = /^ */
const blank = /^( |\t)*$/
const ATX = /^(#{1,6})($| .*)/
const ATX_CLOSE = /( #+ *$|^#+$)/
const thematicBreak = /^([-*_]) *(?:\1 *){2,}$/

export class BlockScanner {
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
    // Tokens list
    const tokens: t.Token[] = []

    for (let line of this.src.split('\n')) {
      // Blank line?
      const isBlank = blank.exec(line)
      if (isBlank) {
        // TODO
      } else {
        // Has indent?
        const hasIndent = indent.exec(line)
        if (hasIndent) {
          // There is open Setext?
        } else {
          // Remove spaces
          line = line.replace(spaces, '')

          // ATX heading?
          const isATX = ATX.exec(line)
          if (isATX) {
            // Grap text
            let text = isATX[2] || ''
            // It may has a closing sequence!
            text = text.replace(ATX_CLOSE, '').trim()

            tokens.push({
              atx: true,
              level: isATX[1].length,
              text,
              type: 'HEADING'
            } as t.Heading)

            // Continue to next line
            continue
          }

          // Thematic break?
          const isThematic = thematicBreak.exec(line)
          if (isThematic) {
            tokens.push({
              char: isThematic[1],
              type: 'THEMATIC_BREAK'
            } as t.ThematicBreak)

            // Continue to next line
            continue
          }
        }
      }
    }
    return tokens
  }
  private paragraph(text: string) {
    return {}
  }
}
