import { Injectable } from '@angular/core';
import { NodeService } from './node.service';
import { Database } from 'sqlite3';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  db: Database = null;

  constructor(private nodeService: NodeService) {
    console.log('Run DbService constructor');
    const htmlPath: string = window.location.pathname;
    const folderPath: string = htmlPath.substr(0, htmlPath.lastIndexOf('/'));
    this.db = new this.nodeService.sqlite3.Database(folderPath + '/../db-dist/japanese.db', this.nodeService.sqlite3.OPEN_READONLY);
  }

  getBonEntries(keyword: string) {
    const isKanji: boolean = keyword.match(/[\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/) !== null;
    const isKana: boolean = keyword.match(/[\u3040-\u309f\u30a0-\u30ff]/) !== null;

    let query: string;

    if (isKanji) {
      query =
        `
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
    } else if (isKana) {
      query =
        `
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
    } else {
      query =
        `
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

    return new Promise((resolve, reject) => {
      this.db.all(query, {
        1: keyword
      }, (err, rows) => {
        // console.log(err);
        // console.log(rows);
        resolve(rows);
      });
    });

  }

  /**
   * @param item row json from dict_index
   * @return entry object
   */
  getDetailsJson(item: any): Promise< any > {

    const sourceId = item.source;
    const id = item.id;

    return new Promise((resolve, reject) => {
      let query = '';
      // JMdict
      if (sourceId === 1) {
        query = 'SELECT json FROM jmdict_jsons WHERE ent_seq = ?'
      }
      // JMnedict
      else if (sourceId === 2) {
        query = 'SELECT json FROM jmnedict_jsons WHERE ent_seq = ?'
      }
      else {
        reject();
      }

      this.db.get(query, id, (err, cell) => {
        if (err) reject(err);
        resolve(cell);
      });
    });
  }
}
