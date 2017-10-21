// Ours
import { Options } from './options'
import { Parser } from './parse'
import { HTMLRenderer } from './render'
import { Scanner } from './scan'

export default (src: string, options: Options = {}): string => {
  const scanner = new Scanner(src)
  const { renderer = new HTMLRenderer() } = options
  const parser = new Parser(scanner.scan(), renderer)
  return parser.parse()
}
