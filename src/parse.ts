import { Renderer } from './render'
import * as t from './tokens'

/**
 * GFM Parser
 */
export class Parser {
  constructor(private tokens: t.Token[], private renderer: Renderer) {}

  public parse(): string {
    // Holds current token
    let tok: t.Token = this.nextToken()
    let output = ''

    while (tok) {
      // Type check
      switch (tok.type) {
        case 'atx_heading':
          output += this.renderer.atx_heading(
            (tok as t.ATXHeading).text,
            (tok as t.ATXHeading).level
          )
          break

        case 'newline':
          output += '\n'
          break

        case 'setext_heading':
          output += this.renderer.setext_heading(
            (tok as t.SetextHeading).text,
            (tok as t.SetextHeading).level
          )
          break

        case 'thematic_break':
          output += this.renderer.thematic_break((tok as t.ThematicBreak).char)
          break
      }

      // Consume next available token
      tok = this.nextToken()
    }

    return output
  }

  private nextToken(): t.Token {
    return this.tokens.shift()
  }
}
