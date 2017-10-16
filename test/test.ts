// Native
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Packages
import test from 'ava'
import { minify } from 'html-minifier'

// Ours
import compile from '../src'

(() => {
  let state = 0 // 0 regular text, 1 markdown example, 2 html output
  let section = ''
  let extensions = []
  let markdownLines = []
  let htmlLines = []
  const tests = []

  const lines = readFileSync(resolve(__dirname, 'spec.txt'), 'utf8').split('\n')

  // Build tests
  lines.forEach((line: string) => {
    line = line.trim()
    if (line.startsWith('```````````````````````````````` example')) {
      state = 1
      extensions = line.substring(40).trim().split(' ')
    } else if (line === '````````````````````````````````') {
      state = 0
      if (!extensions.includes('disabled')) {
        tests.push({
          extensions,
          html: htmlLines.join().replace('→', '\t'),
          markdown: markdownLines.join().replace('→', '\t'),
          section
        })
        markdownLines = []
        htmlLines = []
      }
    } else if (line === '.') {
      state = 2
    } else if (state === 1) {
      markdownLines.push(line)
    } else if (state === 2) {
      htmlLines.push(line)
    } else if (state === 0 && /#+ /.test(line)) {
      section = /#+(.*)/.exec(line)[1].trim()
    }
  })

  // Run tests
  // tslint:disable
  tests.forEach((cas) => {
    test(`${cas['section']} [${cas['extensions'].join(',')}]`, (t) => {
      const actual = minify(compile(cas['markdown']))
      t.is(minify(cas['html']), actual)
    })
  })
})()
