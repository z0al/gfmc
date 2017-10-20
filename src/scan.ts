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

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]

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
          // Remove spaces
          line = line.replace(spaces, '')

          // ATX heading?
          const isATX = this.ATX.exec(line)
          if (isATX) {
            if (this.insideSetext) {
              tokens.push(this.paragraphToken())
            }
            // Grap text
            let text = isATX[2] || ''
            // It may has a closing sequence!
            text = text.replace(this.ATX_CLOSE, '').trim()

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
          const isThematic = this.THEMATIC_BREAK.exec(line)
          if (isThematic) {
            if (this.insideSetext) {
              if (/^-+$/.exec(line)) {
                tokens.push(this.setextToken(2))

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
            tokens.push(this.setextToken(line[0] === '=' ? 1 : 2))

            // Continue to next line
            continue
          }

          if (i === lines.length - 1) {
            // This is the last line so this is a paragraph
            if (this.insideSetext) {
              tokens.push(this.paragraphToken())
            } else {
              this.buffer = line
              tokens.push(this.paragraphToken())
            }
          } else {
            // Assuming Setext heading start
            this.insideSetext = true
            this.buffer += line + '\n'
          }
        }
      }
    }
    return tokens
  }
  private paragraphToken(): t.Paragraph {
    const text = this.reset()
    return { type: 'PARAGRAPH', text: text.trim() }
  }
  private setextToken(level: number): t.Heading {
    const text = this.reset()
    return {
      atx: false,
      level,
      text: text.trim(),
      type: 'HEADING'
    }
  }

  private reset(): string {
    this.insideSetext = false
    const str = this.buffer
    this.buffer = ''
    return str
  }
}
