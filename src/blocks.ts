/**
 * Block parsing implementation.
 * 
 * For a high-level overview of the block parsing process,
 * see https://github.github.com/gfm/#phase-1-block-structure
 */

// Ours
import { calculateSpaces } from './helpers'
import * as t from './types'

// Constants
const ATX = /^(#{1,6})($|(?: |\t).*)/
const ATX_CLOSE = /((?: |\t)#+(?: |\t)*$|^#+$)/
const SETEXT_CLOSE = /^(-{2,}|=+)(?: |\t)*$/
const THEMATIC_BREAK = /^([-*_])(?: |\t)*(?:\1(?: |\t)*){2,}$/

const INDENT = /^ {0,3}\t| {4}/
const SPACES = /^ */
const BLANK = /^( |\t)*$/

export class Scanner {
  // Tokens
  private tokensList: t.Token[] = []

  // Flags
  private insideCodeBlock = false
  private insideParagraph = false

  // Helpers
  private src: string
  private buffer = ''

  constructor(src: string) {
    // For security reasons, the Unicode character U+0000 must be replaced with
    // the REPLACEMENT CHARACTER (U+FFFD).
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
  public tokens(): t.Token[] {
    this.tokensList = []
    const lines = this.src.split('\n')

    for (let lineNo = 0; lineNo < lines.length; lineNo++) {
      let line = lines[lineNo]
      // Last line?
      const last = lineNo === lines.length - 1

      // Blank line?
      if (line.match(BLANK)) {
        this.handleBlankLine(line, last)

        continue
      }

      // Has indentation?
      const spaces = calculateSpaces(line)
      if (spaces >= 4) {
        this.handleIndentation(line, last)

        continue
      }

      // Open code block?
      if (this.insideCodeBlock) {
        this.tokensList.push(this.codeBlockToken())
      }

      // Remove spaces from the beginning only
      line = line.replace(SPACES, '')

      // ATX heading?
      const atx = line.match(ATX)
      if (atx) {
        if (this.insideParagraph) {
          this.tokensList.push(this.paragraphToken())
        }
        // Add the text to buffer
        this.addBuffer(
          // It may has a closing sequence!
          (atx[2] || '').replace(ATX_CLOSE, '').trim()
        )

        this.tokensList.push(this.headingToken(atx[1].length, true))

        continue
      }

      // Thematic break?
      const thematic = line.match(THEMATIC_BREAK)
      if (thematic) {
        if (this.insideParagraph) {
          if (line.match(SETEXT_CLOSE)) {
            this.tokensList.push(this.headingToken(2))

            continue
          }
          this.tokensList.push(this.paragraphToken())
        }

        this.tokensList.push({
          char: thematic[1],
          type: 'THEMATIC_BREAK'
        } as t.ThematicBreak)

        continue
      }

      // Closing Setext heading?
      if (line.match(SETEXT_CLOSE) && this.insideParagraph) {
        this.tokensList.push(this.headingToken(line[0] === '=' ? 1 : 2))

        continue
      }

      if (last) {
        // If we ain't inside a paragraph then we have no buffer; use this
        // line as a buffer
        if (!this.insideParagraph) {
          // DO NOT use this.addBuffer here!
          this.buffer = line
        }
        // It must be paragraph anyway!
        this.tokensList.push(this.paragraphToken())
      } else {
        // Let's assume paragraph start and move forward
        this.insideParagraph = true
        this.addBuffer(line)
      }
    }

    // Done!
    return this.tokensList
  }

  // ==================================================================
  // > Handlers
  // ==================================================================

  // Blank lines
  private handleBlankLine(line: string, last: boolean) {
    // Are we inside paragraph?
    if (this.insideParagraph) {
      this.tokensList.push(this.paragraphToken())
    } else if (this.insideCodeBlock) {
      // A code block?
      // The line has more than 4 spaces?
      if (calculateSpaces(line) >= 4) {
        this.addBuffer(line.replace(INDENT, ''))
      } else {
        // Add a blank line
        this.addBuffer('')
      }

      if (last) {
        this.tokensList.push(this.codeBlockToken())
      }
    }
  }

  // Indented lines
  private handleIndentation(line: string, last: boolean) {
    // An indented code block cannot interrupt a paragraph
    if (this.insideParagraph) {
      this.addBuffer(line)
    } else {
      // OK, it must be a code block
      this.insideCodeBlock = true
      // The first 4 spaces aren't part of the content
      this.addBuffer(line.replace(INDENT, ''))

      if (last) {
        this.tokensList.push(this.codeBlockToken())
      }
    }
  }

  // ==================================================================
  // > Token Helpers
  // ==================================================================

  // Code block
  private codeBlockToken(): t.CodeBlock {
    // Blank lines preceding or following an indented code block are not
    // included in it
    return { code: this.reset().replace(/\n{2,}$/, '\n'), type: 'CODE_BLOCK' }
  }

  // Heading
  private headingToken(level: number, atx = false): t.Heading {
    return { atx, level, text: this.reset().trim(), type: 'HEADING' }
  }
  // Paragraph
  private paragraphToken(): t.Paragraph {
    return { text: this.reset().trim(), type: 'PARAGRAPH' }
  }

  // ==================================================================
  // > Other utils
  // ==================================================================

  /**
   * Adds given string to buffer
   * 
   * @param text 
   */
  private addBuffer(text: string) {
    // Well, I only added this method to prevent missing '\n's ;)
    this.buffer += text + '\n'
  }

  /**
   * Resets everything to its default (i.e. buffer, flags ..etc)
   * 
   * @returns the old buffer
   */
  private reset(): string {
    this.insideCodeBlock = false
    this.insideParagraph = false
    const str = this.buffer
    this.buffer = ''
    return str
  }
}
