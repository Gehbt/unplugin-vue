import { resolve } from 'path'
import { describe, it, expect } from 'vitest'
import { rollup } from 'rollup'
import glob from 'fast-glob'
import Vue from '../src/rollup'

describe('transform', () => {
  describe('fixtures', async () => {
    const root = resolve(__dirname, '..')
    const files = await glob('test/fixtures/*.{vue,js,ts}', {
      cwd: root,
      onlyFiles: true,
    })

    for (const file of files) {
      it(file.replaceAll('\\', '/'), async () => {
        const bundle = await rollup({
          input: [resolve(root, file)],
          external: ['vue'],
          plugins: [
            Vue({
              reactivityTransform: true,
            }),
          ],
        })
        const output = await bundle.generate({ format: 'esm' })
        expect(output.output[0].code).toMatchSnapshot()
      })
    }
  })
})
