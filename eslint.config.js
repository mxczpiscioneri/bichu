const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  // tools/3d-pipeline is an offline Node tool with its own package.json, not app code.
  globalIgnores(['dist/*', 'node_modules/*', '.expo/*', 'tools/3d-pipeline/**']),
  expoConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['scripts/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
  {
    // Metro only bundles static require(); the expo preset allow-lists image/audio but not .glb.
    files: ['src/content/media.generated.ts'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
]);
