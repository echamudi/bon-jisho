const path = require('path');

// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
global.__static = path.join(__dirname, '../static');

require('../src/main/db.spec');
