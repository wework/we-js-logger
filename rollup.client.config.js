import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';

const pkgName = 'we-js-logger';

export default {
  entry: 'src/client.js',
  targets: [
    {
      dest: 'dist/client.js',
      sourceMap: 'dist/client.map.js',
      format: 'cjs'
    },
  ],
  moduleId: pkgName,
  moduleName: pkgName,
  plugins: [
    filesize(),

    babel({
      exclude: './node_modules/**',
      moduleIds: true,
      comments: false,

      // Custom babelrc for build
      babelrc: false,
      presets: [
        [ 'es2015', { 'modules': false } ],
        'stage-0',
      ],
      plugins: [
        'external-helpers'
      ]
    })
  ]
};
