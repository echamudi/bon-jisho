import { c } from 'Lib/const';

export type KanjiReadingPair = {kanji: string, reading: string};
export type KanjiReadingPairs = KanjiReadingPair[];
export type DictSource = c;

/**
 * Similar to DictSource, but using text
 */
export type DictSourceT = 'jmdict' | 'jmnedict';

export type EntryDetailsQuery = {
  source: c.JMDICT | c.JMNEDICT,
  id: number,
  kanji: string | null,
  reading: string
} | null;

export type EntryDetailsHistory = {
  stack: EntryDetailsQuery[],
  pointer: number,
};
