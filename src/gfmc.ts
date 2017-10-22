// Ours
import { Scanner } from './blocks'
import { Parser } from './parse'
import { HTMLRenderer, Renderer } from './render'

// Compiler options
export interface Options {
  renderer?: Renderer
}

// Compiler entry point
const gfmc = (src: string, options: Options = {}): string => {
  const scanner = new Scanner(src)
  const { renderer = new HTMLRenderer() } = options
  const parser = new Parser(scanner.scan(), renderer)
  return parser.parse()
}

export default gfmc
