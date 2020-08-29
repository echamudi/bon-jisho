import { c } from '../lib/const';

export type KanjiReadingPair = {kanji: string, reading: string};
export type KanjiReadingPairs = KanjiReadingPair[];
export type DictSource = c;

export type EntryDetailsQuery = {
  source: number,
  id: number,
  kanji: string | null,
  reading: string
} | null;

export type EntryDetailsHistory = {
  stack: EntryDetailsQuery[],
  pointer: number,
};
