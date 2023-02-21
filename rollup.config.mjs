import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const shared = {
  plugins: [
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
