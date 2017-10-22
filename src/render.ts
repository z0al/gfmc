/**
 * Renderer interface
 */
export interface Renderer {
  codeBlock(code: string): string
  heading(text: string, level: number, atx: boolean): string
  paragraph(text: string): string
  thematicBreak(char: string): string
}

/**
 * Converts GFM to HTML
 */
export class HTMLRenderer implements Renderer {
  public codeBlock(code: string) {
    return `<pre><code>${code}</code></pre>`
  }

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
