const { getTagDescription } = require('./entities');

test('getTagDescription', () => {
  expect(
    getTagDescription('nf40'),
  ).toBe('This word is ranked between 19501-20000 in the Mainichi Shimbun frequency list.');

  expect(
    getTagDescription('ichi1'),
  ).toBe('This word appears in 10,000 selected vocabularies collection (Ichimango goi bunruishuu, Senmon Kyouiku).');

  expect(
    getTagDescription('randomtag'),
  ).toBe('');
});
