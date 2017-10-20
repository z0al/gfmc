/**
 * Renderer interface
 */
export interface Renderer {
  heading(text: string, level: number, atx: boolean): string
  paragraph(text: string): string
  thematicBreak(char: string): string
}

/**
 * Converts GFM to HTML
 */
export class HTMLRenderer implements Renderer {
  public heading(text: string, level: number, atx: boolean) {
    return `<h${level}>${text}</h${level}>`
  }
  public paragraph(text: string) {
    return `<p>${text}</p>`
  }
  public thematicBreak(char: string) {
    return '<hr>'
  }
}
