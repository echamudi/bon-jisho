const { getTagDescription } = require('./entities');

test('getTagDescription', () => {
  expect(
    getTagDescription('nf40'),
  ).toBe('This word is ranked between 19501-20000 in the Mainichi Shimbun frequency list.');
});
