import { Options } from './options'
import { Parser } from './parse'
import { HTMLRenderer } from './render'
import { BlockScanner } from './scan'

export default (src: string, options: Options = {}): string => {
  const scanner = new BlockScanner(src)
  const { renderer = new HTMLRenderer() } = options
  const parser = new Parser(scanner.scan(), renderer)
  return parser.parse()
}
