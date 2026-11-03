import { build } from 'esbuild'
import { cp, mkdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const outdir = join(root, 'public', 'assets')

await rm(outdir, { recursive: true, force: true })
await mkdir(outdir, { recursive: true })

const entries = ['blocknote', 'crepe', 'vditor']
for (const name of entries) {
  const result = await build({
    entryPoints: [join(root, 'src', `${name}.js`)],
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    target: 'chrome110',
    minify: true,
    legalComments: 'none',
    outdir,
    entryNames: name,
    assetNames: `${name}-[name]`,
    loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file', '.png': 'file', '.svg': 'file' },
    logLevel: 'error',
  })
  for (const file of result.outputFiles) {
    const { writeFile } = await import('node:fs/promises')
    await mkdir(dirname(file.path), { recursive: true })
    await writeFile(file.path, file.contents)
    console.log(name, file.path.replace(root + '/', ''), file.contents.length)
  }
}

await cp(join(root, 'node_modules', 'vditor', 'dist'), join(root, 'public', 'vditor', 'dist'), { recursive: true })
console.log('copied vditor dist')
