// Packages
import typescript from 'rollup-plugin-typescript'

// Ours
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      // CommonJS (for Node) build
      file: pkg.main,
      format: 'cjs'
    },
    {
      // browser-friendly UMD build
      file: pkg.browser,
      format: 'umd',
      name: 'gfmc'
    },
    {
      // ES module (for bundlers) build
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
}
