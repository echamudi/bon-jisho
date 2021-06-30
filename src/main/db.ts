import { JapaneseDB } from 'japanese-db';
import * as sqlite3 from 'sqlite3';
import * as path from 'path';

declare const __static: string;

const db = (() => {
  if (process.env.JEST_WORKER_ID) {
    return new sqlite3.Database(path.join(__dirname, '../../static/db-dist/japanese.db'), sqlite3.OPEN_READONLY);
  } else {
    return new sqlite3.Database(path.join(__static, '/db-dist/japanese.db'), sqlite3.OPEN_READONLY);
  }
})();

export function getDictIndexRows(
  query: {
    keyword: string,
    column: 'kanji-exact' | 'kanji' | 'reading' | 'meaning' | 'id'
  }): Promise<JapaneseDB.DictIndexRow[]> {

  const { keyword, column } = query;

  let sql: string;

  if (column === 'kanji') {
    sql = `
      SELECT *
      FROM dict_index
      WHERE
        kanji LIKE '%' || ?1 || '%'
      ORDER BY
        CASE
          WHEN kanji = ?1 AND pri_point IS NOT NULL THEN 0
          WHEN kanji LIKE ?1 || '%' AND pri_point IS NOT NULL THEN 1
          WHEN kanji LIKE '%' || ?1 || '%' AND pri_point IS NOT NULL THEN 2
          WHEN kanji = ?1 THEN 3
          WHEN kanji LIKE ?1 || '%' THEN 4
          WHEN kanji LIKE '%' || ?1 || '%' THEN 5
          ELSE 6
        END,
        pri_point ASC, reading ASC
      LIMIT 1000
      ;
    `;
  } else if (column === 'reading') {
    sql = `
      SELECT *
      FROM dict_index
      WHERE
        reading LIKE '%' || ?1 || '%'
      ORDER BY
        CASE
          WHEN reading = ?1 AND pri_point IS NOT NULL THEN 0
          WHEN reading LIKE ?1 || '%' AND pri_point IS NOT NULL THEN 1
          WHEN reading LIKE '%' || ?1 || '%' AND pri_point IS NOT NULL THEN 2
          WHEN reading = ?1 THEN 3
          WHEN reading LIKE ?1 || '%' THEN 4
          WHEN reading LIKE '%' || ?1 || '%' THEN 5
          ELSE 6
        END,
        pri_point ASC, reading ASC
      LIMIT 1000
      ;
    `;
  } else if (column === 'id') {
    sql = `
      SELECT *
      FROM dict_index
      WHERE
        id = ?1
      ;
    `;
  } else if (column === 'kanji-exact') {
    sql = `
      SELECT *
      FROM dict_index
      WHERE
        kanji = ?1
      ;
    `;
  } else {
    sql = `
      SELECT *
      FROM dict_index
      WHERE
        meaning LIKE '%' || ?1 || '%'
      ORDER BY
        CASE
          /* Exact definitions and the only one */
          WHEN meaning = 'to ' || ?1 || '; ' THEN 0
          WHEN meaning = ?1 || '; ' THEN 1

          /* Exact definitions at the first */
          WHEN meaning LIKE 'to ' || ?1 || ';%' THEN 2
          WHEN meaning LIKE ?1 || ';%' THEN 3

          /* Not exact definition but located at first*/
          WHEN meaning LIKE 'to ' || ?1 || ' %' THEN 4
          WHEN meaning LIKE ?1 || ' %' THEN 5
          WHEN meaning LIKE 'to ' || ?1 || '%' THEN 6
          WHEN meaning LIKE ?1 || '%' THEN 7

          /* Exact definitions at middle/end */
          WHEN meaning LIKE '%; to ' || ?1 || '; %' THEN 8
          WHEN meaning LIKE '%; ' || ?1 || '; %' THEN 9

          /* Not exact definitions but word by itself */
          WHEN meaning LIKE '% ' || ?1 || ' %' THEN 10
          ELSE 11
        END,
        pri_point ASC, reading ASC
      LIMIT 1000
      ;
    `;
  }

  return new Promise((resolve) => {
    db.all(sql, {
      1: keyword,
    }, (_err: any, rows: any[]) => {
      const postProcessed = rows.map((row) => ({
        ...row,
        furigana: JSON.parse(row.furigana),
        tags: JSON.parse(row.tags),
      }));
      resolve(postProcessed);
    });
  });
}

export function getDictIndexRow(
  query: {
    source: number,
    id: number,
    kanji: string | null,
    reading: string
  }): Promise<JapaneseDB.DictIndexRow|null> {

  const { source, id, kanji, reading } = query;

  let sql: string = ' SELECT * FROM dict_index WHERE TRUE ';

  if (source !== undefined && source !== null) sql += ' AND source = ?1 ';
  if (id !== undefined && id !== null) sql += ' AND id = ?2 ';
  if (kanji !== undefined && kanji !== null) sql += ' AND kanji = ?3 ';
  if (reading !== undefined && reading !== null) sql += ' AND reading = ?4 ';

  return new Promise((resolve) => {
    db.get(sql, {
      1: source,
      2: id,
      3: kanji,
      4: reading,
    }, (err: any, row: any) => {
      if (row === undefined) {
        resolve(null);
        return;
      }

      const postProcessed = {
        ...row,
        furigana: JSON.parse(row.furigana),
        tags: JSON.parse(row.tags),
      };
      resolve(postProcessed);
    });
  });
}

// export function getEntities(query: {}): Promise<{jmdict: JapaneseDB.JMdictEntitiesRow[], b: JapaneseDB.JMnedictEntitiesRow[]}> { }

export function getJMdictJsonsRows(query: {entSeqs: number[]}): Promise<JapaneseDB.JMdictJsonsRow[]> {
  const { entSeqs } = query;
  const wildCards = Array(entSeqs.length).fill('?').join(',');

  const sql = `SELECT * FROM jmdict_jsons WHERE ent_seq IN (${wildCards})`;

  return new Promise((resolve) => {
    db.all(sql, entSeqs, (err: any, rows: any[]) => {
      const postProcessed = rows.map((value) => ({
        ent_seq: value.ent_seq,
        json: JSON.parse(value.json),
      }));
      resolve(postProcessed);
    });
  });
}

export function getJMnedictJsonsRows(query: { entSeqs: number[] }): Promise<JapaneseDB.JMnedictJsonsRow[]> {
  const { entSeqs } = query;
  const wildCards = Array(entSeqs.length).fill('?').join(',');

  const sql = `SELECT * FROM jmnedict_jsons WHERE ent_seq IN (${wildCards})`;

  return new Promise((resolve) => {
    db.all(sql, entSeqs, (err: any, rows: any[]) => {
      const postProcessed = rows.map((value) => ({
        ent_seq: value.ent_seq,
        json: JSON.parse(value.json),
      }));
      resolve(postProcessed);
    });
  });
}

// export function getKanjidicRows(query: {kanjiChars: string[]}): Promise<JapaneseDB.KanjidicRow[]> { }

export function getKanjivgTreeRows(query: {kanjiChars: string[]}): Promise<JapaneseDB.KanjivgTreeRow[]> {
  const { kanjiChars } = query;
  const wildCards = Array(kanjiChars.length).fill('?').join(',');

  const sql = `SELECT * FROM kanjivg_tree WHERE kanji IN (${wildCards})`;

  return new Promise((resolve) => {
    db.all(sql, kanjiChars, (err: any, rows: any[]) => {
      // const postProcessed = rows.map((value) => ({
      //   ent_seq: value.ent_seq,
      //   json: JSON.parse(value.json),
      // }));
      resolve(rows);
    });
  });
}
