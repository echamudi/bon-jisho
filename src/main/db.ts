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
  }): Promise<JapaneseDB.DictIndexRow | null> {

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

export function getJMdictJsonsRows(query: { entSeqs: number[] }): Promise<JapaneseDB.JMdictJsonsRow[]> {
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

export function getKanjidicRows(query: { kanjiChars: string[] }): Promise<JapaneseDB.KanjidicRow[]> {
  const { kanjiChars } = query;
  const wildCards = Array(kanjiChars.length).fill('?').join(',');

  const sql = `SELECT * FROM kanjidic WHERE literal IN (${wildCards})`;

  return new Promise((resolve) => {
    db.all(sql, kanjiChars, (err: any, rows: any[]) => {
      const postProcessed = rows.map((value) => ({
        ...value,
        variant: JSON.parse(value.variant),
        dic_number: JSON.parse(value.dic_number),
        query_code: JSON.parse(value.query_code),
        reading: JSON.parse(value.reading),
        meaning: JSON.parse(value.meaning),
        nanori: JSON.parse(value.nanori)
      })) as any;
      resolve(postProcessed);
    });
  });
}

export function getKanjiAliveRows(query: { kanjiChars: string[] }): Promise<JapaneseDB.KanjiAliveRow[]> {
  const { kanjiChars } = query;
  const wildCards = Array(kanjiChars.length).fill('?').join(',');

  const sql = `SELECT * FROM kanjialive WHERE kanji IN (${wildCards})`;

  return new Promise((resolve) => {
    db.all(sql, kanjiChars, (err: any, rows: any[]) => {
      const postProcessed = rows.map((value) => ({
        ...value,
        examples: JSON.parse(value.examples),
      })) as any;
      resolve(postProcessed);
    });
  });
}

export function getKanjivgTreeRows(query: { kanjiChars: string[] }): Promise<JapaneseDB.KanjivgTreeRow[]> {
  const { kanjiChars } = query;
  const wildCards = Array(kanjiChars.length).fill('?').join(',');

  const sql = `SELECT * FROM kanjivg_tree WHERE kanji IN (${wildCards})`;

  return new Promise((resolve) => {
    db.all(sql, kanjiChars, (err: any, rows: any[]) => {
      const postProcessed = rows.map((value) => ({
        kanji: value.kanji,
        tree_json: JSON.parse(value.tree_json),
      }));
      resolve(postProcessed);
    });
  });
}

export interface RelatedKanjiAggregateRow {
  literal: string,
  related_antonyms: string[],
  related_lookalikes: string[],
  related_synonyms: string[],
  related_variants: string[],
};

export function getRelatedKanjiAggregateRows(query: { kanjiChars: string[] }): Promise<RelatedKanjiAggregateRow[]> {
  const { kanjiChars } = query;
  const wildCards = Array(kanjiChars.length).fill('?').join(',');

  const sql = `SELECT
    literal,
    related_antonyms.array as \`related_antonyms\`,
    related_lookalikes.array as \`related_lookalikes\`,
    related_synonyms.array as \`related_synonyms\`,
    related_variants.array as \`related_variants\`
    FROM kanjidic
    LEFT JOIN related_antonyms on kanjidic.literal == related_antonyms.kanji
    LEFT JOIN related_lookalikes on kanjidic.literal == related_lookalikes.kanji
    LEFT JOIN related_synonyms on kanjidic.literal == related_synonyms.kanji
    LEFT JOIN related_variants on kanjidic.literal == related_variants.kanji
    WHERE literal IN (${wildCards});`

  return new Promise((resolve) => {
    db.all(sql, kanjiChars, (err: any, rows: any[]) => {
      const postProcessed = rows.map((value) => ({
        literal: value.literal,
        related_antonyms: JSON.parse(value.related_antonyms),
        related_lookalikes: JSON.parse(value.related_lookalikes),
        related_synonyms: JSON.parse(value.related_synonyms),
        related_variants: JSON.parse(value.related_variants),
      }));
      resolve(postProcessed);
    });
  });
}

export interface KanjiQuickDataRow {
  literal: string,
  kanken: number | null,
  jlpt_new: number | null,
  on: string[] | null,
  kun: string[] | null,
  meaning: string[] | null,
};

export function getKanjiQuickDataRows(query: { kanjiChars: string[] }): Promise<Record<string, KanjiQuickDataRow>> {
  const { kanjiChars } = query;
  const wildCards = Array(kanjiChars.length).fill('?').join(',');

  const sql = `
  SELECT
    literal,
    reading,
    meaning,
    kanji_groups.kanken,
    kanji_groups.jlpt_new
  FROM kanjidic
  LEFT JOIN kanji_groups on kanjidic.literal == kanji_groups.kanji
  WHERE literal IN (${wildCards});`

  return new Promise((resolve) => {
    db.all(sql, kanjiChars, (err: any, rows: any[]) => {
      const postProcessed = rows.map((value) => {

        const reading: { [key: string]: string; }[] | null = JSON.parse(value.reading);
        let on = reading?.filter((val) => val.r_type === 'ja_on').map((val) => val.$t) ?? null;
        let kun = reading?.filter((val) => val.r_type === 'ja_kun').map((val) => val.$t) ?? null;

        if (on?.length === 0) on = null;
        if (kun?.length === 0) kun = null;

        return {
          literal: value.literal,
          kanken: value.kanken,
          jlpt_new: value.jlpt_new,
          on,
          kun,
          meaning: JSON.parse(value.meaning),
        };
      });

      const fin: Record<string, KanjiQuickDataRow> = {};
      postProcessed.forEach((el) => {
        fin[el.literal] = el;
      });

      resolve(fin);
    });
  });
}

export function getWordsByTag(query: { tag: string }): Promise<JapaneseDB.DictIndexRow[]> {
  const { tag } = query;

  const sql = `SELECT source, id, kanji, reading FROM dict_index WHERE tags LIKE '%"' || ?1 || '"%' GROUP BY id ORDER BY reading ASC`;

  return new Promise((resolve) => {
    db.all(sql, {
      1: tag,
    }, (_err: any, rows: any[]) => {
      const postProcessed = rows.map((row) => ({
        ...row,
      }));
      resolve(postProcessed);
    });
  });
}

export interface KanjiGroupRow {
  literal: string,
  stroke_count: number,
  freq: number | null,
  jlpt: number | null,
  kanken: number | null,
  jlpt_new: number | null
}

export function getKanjiGroups(): Promise<KanjiGroupRow[]> {
  const sql = `SELECT literal, stroke_count, freq, jlpt, kanken, jlpt_new FROM kanjidic LEFT JOIN kanji_groups on kanjidic.literal == kanji_groups.kanji ORDER BY freq ASC NULLS LAST;`;

  return new Promise((resolve) => {
    db.all(sql, (_err: any, rows: any[]) => {
      // const postProcessed = rows.map((row) => ({
      //   ...row,
      // }));
      resolve(rows);
    });
  });
}
