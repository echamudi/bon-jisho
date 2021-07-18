import { getTagDescription } from 'Lib/entities';

test('getTagDescription', () => {
  expect(
    getTagDescription('nf40'),
  ).toBe('This word is ranked between 19501-20000 in the Mainichi Newspaper frequency list.');

  expect(
    getTagDescription('ichi1'),
  ).toBe('This word appears in the 10,000 selected vocabularies collection by Senmon Kyouiku. (Ichimango goi bunruishuu)');

  expect(
    getTagDescription('randomtag'),
  ).toBe('');
});
