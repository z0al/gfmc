/**
 * Renderer interface
 */
export interface Renderer {
  atx_heading(text: string, level: number): string
  thematic_break(char: string): string
}

/**
 * Converts GFM to HTML
 */
export class HTMLRenderer implements Renderer {
  public atx_heading(text: string, level: number) {
    return `<h${level}>${text}</h${level}>`
  }
  public thematic_break(char: string) {
    return '<hr/>'
  }
}
