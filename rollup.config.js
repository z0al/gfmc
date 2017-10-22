// Packages
import typescript from 'rollup-plugin-typescript2'

// Ours
import pkg from './package.json'

// Generates Rollup entries for test files
const testFiles = () => {
  const entries = ['spec', 'helpers']
  return entries.map(e => {
    return {
      input: `./test/${e}.ts`,
      output: [{ file: `dist/test/${e}.js`, format: 'cjs' }],
      external: ['ava'],
      plugins: [typescript()]
    }
  })
}

export default [
  // Browser build
  {
    input: 'src/index.ts',
    output: [{ file: pkg.browser, format: 'umd', name: 'gfmc' }],
    plugins: [
      typescript({ tsconfigOverride: { compilerOptions: { target: 'es5' } } })
    ]
  },
  // Node.js/Bundlers
  {
    input: 'src/index.ts',
    output: [
      // CommonJS (for Node) build
      { file: pkg.main, format: 'cjs' },
      // ES module (for bundlers) build
      { file: pkg.module, format: 'es' }
    ],
    plugins: [typescript()]
  },
  // Test files
  ...testFiles()
]
