// Native
import { readdirSync } from 'fs'
import { resolve, basename } from 'path'

// Packages
import typescript from 'rollup-plugin-typescript'

// Ours
import pkg from './package.json'

const plugins = [
  typescript({
    typescript: require('typescript')
  })
]

// Generates Rollup entries for test files
const testFiles = () => {
  const entries = readdirSync(resolve(__dirname, 'test'))
  return entries.map(e => {
    return {
      input: `test/${e}`,
      output: [{ file: `dist/${basename(e, '.ts')}-test.js`, format: 'cjs' }],
      external: ['ava'],
      plugins
    }
  })
}

export default [
  // Main bundle
  {
    input: 'src/index.ts',
    output: [
      // CommonJS (for Node) build
      { file: pkg.main, format: 'cjs' },
      // Browser-friendly UMD build
      { file: pkg.browser, format: 'umd', name: 'gfmc' },
      // ES module (for bundlers) build
      { file: pkg.module, format: 'es' }
    ],
    plugins
  },
  // Test files
  ...testFiles()
]
