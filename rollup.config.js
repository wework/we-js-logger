import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import conditional from 'rollup-plugin-conditional';
import cleanup from 'rollup-plugin-cleanup';

// Valid build targets
const supportedRuntimes = [
  'client',
  'node'
];

// NPM injects the name from `package.json` to this env var
const pkgName = process.env.npm_package_name;

// Pass to rollup via --environment flag
const runtimeEnv = process.env.RUNTIME_ENV;

if (!supportedRuntimes.includes(runtimeEnv)) {
  throw new Error(
    `Invalid runtime environment ${runtimeEnv} sepcified. Valid options: ${supportedRuntimes.join(', ')}`
  );
}

export default {
  input: `src/${runtimeEnv}.js`,
  output: [
    {
      file: `dist/${runtimeEnv}.js`,
      sourcemap: `dist/${runtimeEnv}.map.js`,
      format: 'cjs'
    }
  ],
  moduleId: pkgName,
  name: pkgName,
  external: [
    'bunyan',
    'bunyan-format',
    'hide-secrets',
    'lodash/isFunction',
    'lodash/isObject',
    'lodash/mapValues',
    'lodash/omit',
    'lodash/pick',
    'lodash/tail',
    'rollbar',

    // Client-only
    'console',
    'le_js',
    'lodash/get',

    // Server
    'le_node',
  ],
  plugins: [

    conditional(
      runtimeEnv === 'client',
      [
        babel({
          exclude: './node_modules/**',
          moduleIds: true,

          // Custom babelrc for build
          babelrc: false,
          presets: [
            [ 'es2015', { 'modules': false } ],
            'stage-0'
          ],
          plugins: [
            'external-helpers'
          ]
        })
      ]
    ),

    cleanup({
      comments: ['some', 'jsdoc']
    }),

    filesize()
  ]
};
