// For Jest
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const babelJest = require('babel-jest');

const babelOptions = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          Main: path.resolve(__dirname, 'src/main/'),
          App: path.resolve(__dirname, 'ng-src/app/'),
          Lib: path.resolve(__dirname, 'lib/'),
        },
      },
    ],
  ],
};

// eslint-disable-next-line import/no-extraneous-dependencies
module.exports = babelJest.createTransformer(babelOptions);
