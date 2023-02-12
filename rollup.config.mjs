import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import replace from 'rollup-plugin-re';
import isBuiltin from 'is-builtin-module';

const shared = {
  plugins: [
    nodeResolve({
      resolveOnly: (module) =>
        module === 'string_decoder' || !isBuiltin(module),
      preferBuiltins: false,
    }),
    replace({
      patterns: [
        {
          match: /formidable(\/|\\)lib/,
          test: 'if (global.GENTLY) require = GENTLY.hijack(require);',
          replace: '',
        },
        {
          match: /'string_decoder\/'/,
          test: "'string_decoder/'",
          replace: "'string_decoder/lib/string_decoder.js'",
        },
      ],
    }),
    commonjs(),
    json(),
    typescript(),
  ],
};

export default [
  {
    ...shared,
    input: 'src/index.ts',
    output: {
      file: 'lib/index.cjs',
      format: 'cjs',
    },
  },
  {
    ...shared,
    input: 'src/index.ts',
    output: {
      file: 'lib/index.mjs',
      format: 'es',
    },
  },
  {
    ...shared,
    input: 'src/cli.ts',
    output: {
      file: 'lib/cli.js',
      format: 'cjs',
    },
  },
];
