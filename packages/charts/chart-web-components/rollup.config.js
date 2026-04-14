/**
 * This config should be shared for all web-component packages.
 * Tracking issue - https://github.com/microsoft/fluentui/issues/33576
 */

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import esbuild, { minify } from 'rollup-plugin-esbuild';
import transformTaggedTemplate from 'rollup-plugin-transform-tagged-template';
import { transformCSSFragment, transformHTMLFragment } from './scripts/transform-fragments';

const parserOptions = {
  sourceType: 'module',
};

const sharedPlugins = [
  nodeResolve({ browser: true }),
  commonJS(),
  esbuild({
    tsconfig: './tsconfig.lib.json',
  }),
  transformTaggedTemplate({
    tagsToProcess: ['css'],
    transformer: transformCSSFragment,
    parserOptions,
  }),
  transformTaggedTemplate({
    tagsToProcess: ['html'],
    transformer: transformHTMLFragment,
    parserOptions,
  }),
];

const peerExternals = ['@fluentui/web-components', '@microsoft/fast-element', '@microsoft/fast-web-utilities', 'tslib'];

export default [
  {
    input: 'src/index-rollup.ts',
    output: [
      {
        file: 'dist/chart-web-components.js',
        format: 'esm',
      },
      {
        file: 'dist/chart-web-components.min.js',
        format: 'esm',
        plugins: [minify()],
      },
    ],
    plugins: sharedPlugins,
  },
  {
    input: 'src/index-rollup.ts',
    output: [
      {
        file: 'dist/chart-web-components.peer.js',
        format: 'esm',
      },
      {
        file: 'dist/chart-web-components.peer.min.js',
        format: 'esm',
        plugins: [minify()],
      },
    ],
    external: peerExternals,
    plugins: sharedPlugins,
  },
];
