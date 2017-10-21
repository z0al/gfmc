import * as t from './tokens'

// Helpers
const indent = /^( {4,})\S/
const spaces = /^ */
const blank = /^( |\t)*$/

export class Scanner {
  // current buffer
  private src: string
  private buffer = ''

  // Flags
  private insideParagraph = false

  // Tokens patterns
  private ATX = /^(#{1,6})($|(?: |\t).*)/
  private ATX_CLOSE = /((?: |\t)#+(?: |\t)*$|^#+$)/
  private SETEXT_CLOSE = /^(-{2,}|=+)(?: |\t)*$/
  private THEMATIC_BREAK = /^([-*_])(?: |\t)*(?:\1(?: |\t)*){2,}$/

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

  /**
   * Scans the source string line by line and generate tokens
   *  
   * @returns {Token[]} list
   */
  public scan(): t.Token[] {
    const tokens: t.Token[] = []
    const lines = this.src.split('\n')

    for (const index of lines.keys()) {
      let line = this.expandTabs(lines[index])

      // Blank line?
      const isBlank = blank.exec(line)
      if (isBlank) {
        // Are we inside paragraph?
        if (this.insideParagraph) {
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
            if (this.insideParagraph) {
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
            if (this.insideParagraph) {
              if (this.SETEXT_CLOSE.exec(line)) {
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
          if (isSetext && this.insideParagraph) {
            tokens.push(this.headingToken(line[0] === '=' ? 1 : 2))

            // Continue to next line
            continue
          }

          // Last line?
          if (index === lines.length - 1) {
            // If we ain't inside a paragraph then we have no buffer; use this
            // line as a buffer
            if (!this.insideParagraph) {
              this.buffer = line
            }
            // It must be paragraph anyway!
            tokens.push(this.paragraphToken())
          } else {
            // Let's assume paragraph start and move forward
            this.insideParagraph = true
            this.buffer += line + '\n'
          }
        }
      }
    }

    // Done!
    return tokens
  }

  /**
   * Expands tabs to spaces at the beginning of string. It doesn't touch 
   * internal tabs or those at the end of string.
   * 
   * This is only meant to make writing checks easier!
   *  
   * @param {string} str 
   */
  public expandTabs(str: string): string {
    const result = str.split('')
    for (const index of result.keys()) {
      const char = result[index]
      if (char.match(/\S/)) {
        // Oops! We've reached the first non-whitespace character, let's quit
        break
      }
      if (char === '\t') {
        result[index] = ' '.repeat(4 - index % 4)
      }
    }
    return result.join('')
  }

  /**
   * Generates Paragraph token from current buffer
   * 
   * @returns {Paragraph} token
   */
  private paragraphToken(): t.Paragraph {
    const text = this.reset().trim()
    return { text, type: 'PARAGRAPH' }
  }

  /**
   * Generates Heading token from current buffer
   * 
   * @param {number} level 
   * @param {boolean} atx 
   * @returns {Heading} token
   */
  private headingToken(level: number, atx = false): t.Heading {
    const text = this.reset().trim()
    return { atx, level, text, type: 'HEADING' }
  }

  /**
   * Resets everything to its default (i.e. buffer, flags ..etc)
   * 
   * @returns the old buffer
   */
  private reset(): string {
    this.insideParagraph = false
    const str = this.buffer
    this.buffer = ''
    return str
  }
}
