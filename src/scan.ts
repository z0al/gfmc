import * as t from './tokens'

// Helpers
const indent = /^( {4,})\S/
const spaces = /^ */
const blank = /^( |\t)*$/

export class Scanner {
  private src: string

  // Tokens patterns
  private ATX = /^(#{1,6})($| .*)/
  private ATX_CLOSE = /( #+ *$|^#+$)/
  private SETEXT_CLOSE = /^(-{2,}|=+)$/
  private THEMATIC_BREAK = /^([-*_]) *(?:\1 *){2,}$/

  // Flags
  private insideSetext = false
  private buffer = '' // current buffer

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

    const lines = this.src.split('\n')

    for (let index = 0; index < lines.length; index++) {
      let line = lines[index]

      // Blank line?
      const isBlank = blank.exec(line)
      if (isBlank) {
        // This is open Setext heading?
        if (this.insideSetext) {
          tokens.push(this.paragraphToken())

          // Continue to next line
          continue
        }
      } else {
        // Has indent?
        const hasIndent = indent.exec(line)
        if (hasIndent) {
          // TODO
        } else {
          // Remove spaces from the beginning only
          line = line.replace(spaces, '')

          // ATX heading?
          const isATX = this.ATX.exec(line)
          if (isATX) {
            if (this.insideSetext) {
              tokens.push(this.paragraphToken())
            }
            // Grap the text
            // It may has a closing sequence!
            this.buffer = (isATX[2] || '').replace(this.ATX_CLOSE, '').trim()

            tokens.push(this.headingToken(isATX[1].length, true))

            // Continue to next line
            continue
          }

          // Thematic break?
          const isThematic = this.THEMATIC_BREAK.exec(line)
          if (isThematic) {
            if (this.insideSetext) {
              if (/^-+( |\t)*$/.exec(line)) {
                tokens.push(this.headingToken(2))

                // Continue to next line
                continue
              }
              tokens.push(this.paragraphToken())
            }

            tokens.push({
              char: isThematic[1],
              type: 'THEMATIC_BREAK'
            } as t.ThematicBreak)

            // Continue to next line
            continue
          }

          // Closing Setext heading?
          const isSetext = this.SETEXT_CLOSE.exec(line)
          if (isSetext && this.insideSetext) {
            tokens.push(this.headingToken(line[0] === '=' ? 1 : 2))

            // Continue to next line
            continue
          }

          // Last line?
          if (index === lines.length - 1) {
            // If we ain't inside Setext heading then use this line as buffer
            if (!this.insideSetext) {
              this.buffer = line
            }
            // It must be paragraph anyway!
            tokens.push(this.paragraphToken())
          } else {
            // Let's assume Setext heading start and move forward
            this.insideSetext = true
            this.buffer += line + '\n'
          }
        }
      }
    }
    return tokens
  }
  private paragraphToken(): t.Paragraph {
    const text = this.reset().trim()
    return { text, type: 'PARAGRAPH' }
  }
  private headingToken(level: number, atx = false): t.Heading {
    const text = this.reset().trim()
    return { atx, level, text, type: 'HEADING' }
  }

  private reset(): string {
    this.insideSetext = false
    const str = this.buffer
    this.buffer = ''
    return str
  }
}
