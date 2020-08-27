const { getEntryDetailsUrl } = require('./url-generator');

test('getEntryDetailsUrl', () => {
  // Normal tests
  expect(
    getEntryDetailsUrl({
      source: 1,
      id: 123,
      kanji: '色',
      reading: 'いろ',
    }),
  ).toBe('/#/entry-details/?source=jmdict&id=123&kanji=%E8%89%B2&reading=%E3%81%84%E3%82%8D');

  expect(
    getEntryDetailsUrl({
      source: 2,
      id: 123,
      kanji: '色',
      reading: 'いろ',
    }),
  ).toBe('/#/entry-details/?source=jmnedict&id=123&kanji=%E8%89%B2&reading=%E3%81%84%E3%82%8D');

  // Null kanji tests
  expect(
    getEntryDetailsUrl({
      source: 1,
      id: 123,
      kanji: null,
      reading: 'いろ',
    }),
  ).toBe('/#/entry-details/?source=jmdict&id=123&kanji=null&reading=%E3%81%84%E3%82%8D');

  // Other tests
  expect(
    // @ts-ignore
    getEntryDetailsUrl(),
  ).toBe(null);

  expect(
    // @ts-ignore
    getEntryDetailsUrl(null),
  ).toBe(null);
});
