/**
 * Renderer interface
 */
export interface Renderer {
  heading(text: string, level: number, atx: boolean): string
  thematicBreak(char: string): string
}

/**
 * Converts GFM to HTML
 */
export class HTMLRenderer implements Renderer {
  public heading(text: string, level: number, atx: boolean) {
    return `<h${level}>${text}</h${level}>`
  }
  public thematicBreak(char: string) {
    return '<hr>'
  }
}
