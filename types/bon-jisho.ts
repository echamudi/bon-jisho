import { c } from 'Lib/const';

export type KanjiReadingPair = {kanji: string, reading: string};
export type KanjiReadingPairs = KanjiReadingPair[];
export type DictSource = c;

/**
 * Similar to DictSource, but using text
 */
export type DictSourceT = 'jmdict' | 'jmnedict' | 'kanjidic';

export type EntryDetailsQuery = JMDetailsQuery | KanjidicQuery | null;

export type JMDetailsQuery = {
  source: c.JMDICT | c.JMNEDICT,
  id: number,
  kanji: string | null,
  reading: string
};

export type KanjidicQuery = {
  source: c.KANJIDIC,
  kanji: string
};

export type EntryDetailsHistory = {
  stack: EntryDetailsQuery[],
  pointer: number,
};
