const path = require('node:path');
const fs = require('node:fs');

const tsConfigPath = path.resolve(__dirname, '../../../../tsconfig.base.wc.json');

module.exports =
  /** @type {import('@storybook/html-vite', { with: { 'resolution-mode': 'import' } }).StorybookConfig} */
  ({
    // helpers.stories.ts is a file that contains helper functions for stories,
    // and should not be treated as a story itself.
    stories: ['../src/**/!(helpers)*.stories.@(ts|mdx)'],
    staticDirs: ['../public'],
    core: {
      disableTelemetry: true,
    },
    framework: '@storybook/html-vite',
    addons: ['@storybook/addon-docs'],
    build: {
      previewUrl: process.env.DEPLOY_PATH,
    },
    viteFinal: async config => {
      const tsAliases = createTypeScriptAliases(tsConfigPath);
      // In this Storybook, resolve web-components from the package entrypoint
      // instead of workspace source to avoid FAST API skew at runtime.
      delete tsAliases['@fluentui/web-components'];

      // Configure path aliases
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        ...tsAliases,
        '@microsoft/fast-element': path.resolve(__dirname, '../../../../node_modules/@microsoft/fast-element'),
      };

      // Add plugin to resolve .ts files when imported with .js extension
      config.plugins = [...(config.plugins || []), createResolveTsAsJsPlugin()];

      return config;
    },
  });

/**
 * Converts TypeScript path mappings from tsconfig to Vite aliases
 *
 * @param {string} configPath - Path to the tsconfig file
 * @returns {Record<string, string>} Vite alias configuration
 */
function createTypeScriptAliases(configPath) {
  const tsConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const paths = tsConfig.compilerOptions?.paths || {};
  const baseUrl = tsConfig.compilerOptions?.baseUrl || '.';
  const baseUrlPath = path.resolve(path.dirname(configPath), baseUrl);

  /** @type {Record<string, string>} */
  const alias = {};
  for (const [key, value] of Object.entries(paths)) {
    const aliasKey = key.replace(/\/\*$/, '');
    const aliasValue = Array.isArray(value) ? value[0] : value;
    const aliasPath = aliasValue.replace(/\/\*$/, '');
    alias[aliasKey] = path.resolve(baseUrlPath, aliasPath);
  }

  return alias;
}

/**
 * Creates a Vite plugin that resolves .ts files when imported with .js extension.
 * This matches webpack's extensionAlias behavior and is needed for imports like
 * '../src/index-rollup.js' to work in production builds.
 * @returns {import('vite', { with: { 'resolution-mode': 'import' } }).Plugin} Vite plugin object
 */
function createResolveTsAsJsPlugin() {
  return {
    name: 'resolve-ts-as-js',
    enforce: 'pre',
    resolveId(/** @type {string} */ id, /** @type {string | undefined} */ importer) {
      // Only handle relative imports that end with .js or .mjs
      if (importer && (id.endsWith('.js') || id.endsWith('.mjs')) && (id.startsWith('./') || id.startsWith('../'))) {
        const resolvedPath = path.resolve(path.dirname(importer), id);
        // Try .ts or .mts extension
        const tsExtension = id.endsWith('.mjs') ? '.mts' : '.ts';
        const tsPath = resolvedPath.replace(/\.(m)?js$/, tsExtension);
        try {
          if (fs.existsSync(tsPath)) {
            return tsPath;
          }
        } catch (e) {
          // Ignore errors
        }
      }
      return null;
    },
  };
}
