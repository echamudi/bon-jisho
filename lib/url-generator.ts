import { c } from './const';
import { EntryDetailsQuery } from 'Types/bon-jisho';

export function getEntryDetailsUrl(query: EntryDetailsQuery): string | null {
  if (!query) {
    return null;
  }

  if (query.source === c.JMDICT || query.source === c.JMNEDICT) {
    const source = query.source === 1 ? 'jmdict' : 'jmnedict';

    const id = encodeURI(query.id.toString());

    let kanji;
    if (query.kanji !== null && query.kanji !== undefined) {
      kanji = encodeURI(query.kanji);
    } else {
      kanji = 'null';
    }
    const reading = encodeURI(query.reading);

    return `#/entry-details/?source=${source}&id=${id}&kanji=${kanji}&reading=${reading}`;
  }

  if (query.source === c.KANJIDIC) {
    let kanji;
    if (query.kanji !== null && query.kanji !== undefined) {
      kanji = encodeURI(query.kanji);
    } else {
      kanji = 'null';
    }

    return `#/entry-details/?source=kanjidic&kanji=${kanji}`;
  }

  return null;
}
