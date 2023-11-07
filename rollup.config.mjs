import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'docs_src/docs.ts',
  output: {
    file: 'docs/docs.js',
    format: 'esm',
  },
  plugins: [
    resolve({
      extensions: ['.js', '.ts'],
    }),
    typescript({ tsconfig: './tsconfig.docs.json' }),
  ],
};
