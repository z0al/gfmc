/**
 * Renderer interface
 */
export interface Renderer {
  atx_heading(text: string, level: number): string
  setext_heading(text: string, level: number): string
  thematic_break(char: string): string
}

/**
 * Converts GFM to HTML
 */
export class HTMLRenderer implements Renderer {
  public atx_heading(text: string, level: number) {
    return `<h${level}>${text}</h${level}>`
  }
  public setext_heading(text: string, level: number) {
    return this.atx_heading(text, level)
  }
  public thematic_break(char: string) {
    return '<hr>'
  }
}
