import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import replace from 'rollup-plugin-re';
import isBuiltin from 'is-builtin-module';

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
  },
  plugins: [
    nodeResolve({
      resolveOnly: module => module === 'string_decoder' || !isBuiltin(module),
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
