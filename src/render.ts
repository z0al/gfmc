/**
 * Renderer interface
 */
export interface Renderer {
  thematic_break(char: string): string
}

/**
 * Converts GFM to HTML
 */
export class HTMLRenderer implements Renderer {
  public thematic_break(char: string) {
    return '<hr/>'
  }
}
