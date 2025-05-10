import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import { dtsPlugin } from 'esbuild-plugin-d.ts'

// Common options
const commonOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2018'],
  plugins: [
    // Exclude external dependencies from the bundle
    nodeExternalsPlugin({
      // Always exclude react and react-dom
      peerDependencies: true,
      dependencies: false,
    }),
    // Generate TypeScript declaration files
    dtsPlugin(),
  ],
}

// Build CJS version
build({
    ...commonOptions,
    outfile: 'dist/index.js',
    format: 'cjs',
  })
  .then(() => console.log('CJS build complete'))
  .catch(() => process.exit(1))

// Build ESM version
build({
    ...commonOptions,
    outfile: 'dist/index.esm.js',
    format: 'esm',
  })
  .then(() => console.log('ESM build complete'))
  .catch(() => process.exit(1))
