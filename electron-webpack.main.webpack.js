const path = require('path');

module.exports = {
  resolve: {
    alias: {
      Main: path.resolve(__dirname, 'src/main/'),
      App: path.resolve(__dirname, 'ng-src/app/'),
      Lib: path.resolve(__dirname, 'lib/'),
    },
  },
};
