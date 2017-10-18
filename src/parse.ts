import { Renderer } from './render'
import { ThematicBreak, Token } from './tokens'

/**
 * GFM Parser
 */
export class Parser {
  constructor(private tokens: Token[], private renderer: Renderer) {}

  public parse(): string {
    // Holds current token
    let tok: Token = this.nextToken()
    let output = ''

    while (tok) {
      // Type check
      switch (tok.type) {
        case 'thematic_break':
          output += this.renderer.thematic_break((tok as ThematicBreak).char)
          break
      }

      // Consume next available token
      tok = this.nextToken()
    }

    return output
  }

  private nextToken(): Token {
    return this.tokens.pop()
  }
}
