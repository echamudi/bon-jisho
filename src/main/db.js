/**
 * @typedef {import('japanese-db').JapaneseDB.DictIndexRow} JapaneseDB.DictIndexRow
 * @typedef {import('japanese-db').JapaneseDB.JMdictEntitiesRow} JapaneseDB.JMdictEntitiesRow
 * @typedef {import('japanese-db').JapaneseDB.JMnedictEntitiesRow} JapaneseDB.JMnedictEntitiesRow
 * @typedef {import('japanese-db').JapaneseDB.JMdictJsonsRow} JapaneseDB.JMdictJsonsRow
 * @typedef {import('japanese-db').JapaneseDB.JMnedictJsonsRow} JapaneseDB.JMnedictJsonsRow
 * @typedef {import('japanese-db').JapaneseDB.KanjidicRow} JapaneseDB.KanjidicRow
 * */

// eslint-disable-next-line spaced-comment
/// <reference types="./main" />

/** */
const sqlite3 = require('sqlite3');
const path = require('path');

const db = new sqlite3.Database(path.join(__static, '/db-dist/japanese.db'), sqlite3.OPEN_READONLY);

// Old

/**
 * @param item row json from dict_index
 * @return entry object
 */
module.exports.getDetailsJson = (item) => {
  const sourceId = item.source;
  const { id } = item;

  return new Promise((resolve, reject) => {
    let query = '';
    if (sourceId === 1) {
      // JMdict
      query = 'SELECT json FROM jmdict_jsons WHERE ent_seq = ?';
    } else if (sourceId === 2) {
      // JMnedict
      query = 'SELECT json FROM jmnedict_jsons WHERE ent_seq = ?';
    } else {
      reject();
    }

    db.get(query, id, (err, cell) => {
      if (err) reject(err);
      resolve(cell);
    });
  });
};

// New

/**
 * @param {{keyword: string, column: "kanji-exact"|"kanji"|"reading"|"meaning"|"id"}} query
 * @returns {Promise<JapaneseDB.DictIndexRow[]>}
 */
module.exports.getDictIndexRows = (query) => {
  const { keyword, column } = query;

  let sql;

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
    }, (err, rows) => {
      const postProcessed = rows.map((row) => ({
        ...row,
        furigana: JSON.parse(row.furigana),
        tags: JSON.parse(row.tags),
      }));
      resolve(postProcessed);
    });
  });
};

/**
 * @param { {
    source: number,
    id: number,
    kanji: string | null,
    reading: string
  }} query
 * @returns {Promise<JapaneseDB.DictIndexRow|null>}
 */
module.exports.getDictIndexRow = (query) => {
  const {
    source, id, kanji, reading,
  } = query;

  let sql;

  if (kanji === null) {
    sql = `
      SELECT *
      FROM dict_index
      WHERE
        source = ?1
        AND id = ?2
        AND reading = ?4
    `;
  } else {
    sql = `
      SELECT *
      FROM dict_index
      WHERE
        source = ?1
        AND id = ?2
        AND kanji = ?3
        AND reading = ?4
    `;
  }

  return new Promise((resolve) => {
    db.get(sql, {
      1: source,
      2: id,
      3: kanji,
      4: reading,
    }, (err, row) => {
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
};

/**
 * @param {{}} query
 * @returns # {Promise<{jmdict: JapaneseDB.JMdictEntitiesRow[], b: JapaneseDB.JMnedictEntitiesRow[]}>}
 */
module.exports.getEntities = (query) => { };

/**
 * @param {{entSeqs: number[]}} query
 * @returns {Promise<JapaneseDB.JMdictJsonsRow[]>}
 */
module.exports.getJMdictJsonsRows = (query) => {
  const { entSeqs } = query;
  const wildCards = Array(entSeqs.length).fill('?').join(',');

  const sql = `SELECT * FROM jmdict_jsons WHERE ent_seq IN (${wildCards})`;

  return new Promise((resolve) => {
    db.all(sql, entSeqs, (err, rows) => {
      const postProcessed = rows.map((value) => ({
        ent_seq: value.ent_seq,
        json: JSON.parse(value.json),
      }));
      resolve(postProcessed);
    });
  });
};

/**
 * @param {{entSeqs: number[]}} query
 * @returns {Promise<JapaneseDB.JMnedictJsonsRow[]>}
 */
module.exports.getJMnedictJsonsRows = (query) => {
  const { entSeqs } = query;
  const wildCards = Array(entSeqs.length).fill('?').join(',');

  const sql = `SELECT * FROM jmnedict_jsons WHERE ent_seq IN (${wildCards})`;

  return new Promise((resolve) => {
    db.all(sql, entSeqs, (err, rows) => {
      const postProcessed = rows.map((value) => ({
        ent_seq: value.ent_seq,
        json: JSON.parse(value.json),
      }));
      resolve(postProcessed);
    });
  });
};

/**
 *
 * @param {{kanjiChars: string[]}} query
 * @returns # {Promise<JapaneseDB.KanjidicRow[]>}
 */
module.exports.getKanjidicRows = (query) => { };
