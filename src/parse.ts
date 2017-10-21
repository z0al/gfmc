// Ours
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
        case 'HEADING':
          output += this.renderer.heading(
            (tok as t.Heading).text,
            (tok as t.Heading).level,
            (tok as t.Heading).atx
          )
          break

        case 'CODE_BLOCK':
          output += this.renderer.codeBlock((tok as t.CodeBlock).code)
          break

        case 'PARAGRAPH':
          output += this.renderer.paragraph((tok as t.Paragraph).text)
          break

        case 'THEMATIC_BREAK':
          output += this.renderer.thematicBreak((tok as t.ThematicBreak).char)
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
