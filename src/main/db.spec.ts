import { getJMdictJsonsRows, getKanjidicRows, getKanjivgTreeRows } from 'Main/db';

test('getJMdictJsonsRows', async () => {
  getJMdictJsonsRows({
    entSeqs: [1639300, 1639360],
  })
    .then((res) => {
      // @ts-ignore
      expect(res)
        .toEqual(
          JSON.parse(
            `[{"ent_seq":1639300,"json":{"ent_seq":["1639300"],
            "k_ele":[{"keb":["世界の果て"]}],"r_ele":[{"reb":["せかいのはて"]}],
            "sense":[{"pos":["exp"],"gloss":[{"xml:lang":"eng","$t":"end of the world"}]}]}},
            {"ent_seq":1639360,"json":{"ent_seq":["1639360"],
            "k_ele":[{"keb":["頁岩"]}],"r_ele":[{"reb":["けつがん"]}],"sense":[{"pos":["n","adj-no"],
            "gloss":[{"xml:lang":"eng","$t":"shale"}]}]}}]`,
          ),
        );
    });
});

test('getKanjidicRows', async () => {
  const res = await getKanjidicRows({ kanjiChars: ['夢'] });

  expect<any>(res)
    .toEqual(
        [
          {
            sort: 2652,
            literal: '夢',
            jis208: '1-44-20',
            jis212: null,
            jis213: null,
            ucs: '5922',
            rad_classical: 36,
            rad_nelson_c: 140,
            grade: 5,
            stroke_count: 13,
            variant: '[{"var_type":"jis208","$t":"1-52-77"},{"var_type":"jis212","$t":"1-24-73"}]',
            freq: 943,
            rad_name: null,
            jlpt: 2,
            dic_number: '[{"dr_type":"nelson_c","$t":"4028"},{"dr_type":"nelson_n","$t":"1131"},{"dr_type":"halpern_njecd","$t":"2336"},{"dr_type":"halpern_kkd","$t":"2939"},{"dr_type":"halpern_kkld","$t":"1510"},{"dr_type":"halpern_kkld_2ed","$t":"2046"},{"dr_type":"heisig","$t":"305"},{"dr_type":"heisig6","$t":"327"},{"dr_type":"gakken","$t":"969"},{"dr_type":"oneill_names","$t":"1990"},{"dr_type":"oneill_kk","$t":"1425"},{"dr_type":"moro","m_vol":"3","m_page":"0361","$t":"5801P"},{"dr_type":"henshall","$t":"1844"},{"dr_type":"sh_kk","$t":"811"},{"dr_type":"sh_kk2","$t":"830"},{"dr_type":"jf_cards","$t":"444"},{"dr_type":"henshall3","$t":"816"},{"dr_type":"tutt_cards","$t":"783"},{"dr_type":"kanji_in_context","$t":"800"},{"dr_type":"kodansha_compact","$t":"407"},{"dr_type":"maniette","$t":"311"}]',
            query_code: '[{"qc_type":"skip","$t":"2-3-10"},{"qc_type":"sh_desc","$t":"3k10.14"},{"qc_type":"four_corner","$t":"4420.7"},{"qc_type":"deroo","$t":"1960"},{"qc_type":"skip","skip_misclass":"posn","$t":"2-8-5"}]',
            reading: '[{"r_type":"pinyin","$t":"meng4"},{"r_type":"korean_r","$t":"mong"},{"r_type":"korean_h","$t":"몽"},{"r_type":"vietnam","$t":"Mộng"},{"r_type":"vietnam","$t":"Mông"},{"r_type":"ja_on","$t":"ム"},{"r_type":"ja_on","$t":"ボウ"},{"r_type":"ja_kun","$t":"ゆめ"},{"r_type":"ja_kun","$t":"ゆめ.みる"},{"r_type":"ja_kun","$t":"くら.い"}]',
            meaning: '["dream","vision","illusion"]',
            nanori: null
          }
        ]
    );
});


test('getKanjivgTreeRows', async () => {
  const res = await getKanjivgTreeRows({ kanjiChars: ['悪', '夢', '悪', '化'] });

  expect(res)
    .toEqual(
      JSON.parse(
        `
        [
          {
              "kanji": "化",
              "tree_json": "{\\"element\\":\\"化\\",\\"g\\":[{\\"element\\":\\"亻\\"},{\\"element\\":\\"匕\\"}]}"
          },
          {
              "kanji": "夢",
              "tree_json": "{\\"element\\":\\"夢\\",\\"g\\":[{\\"g\\":[{\\"element\\":\\"艹\\"},{\\"element\\":\\"罒\\"},{\\"element\\":\\"冖\\"}]},{\\"element\\":\\"夕\\"}]}"
          },
          {
              "kanji": "悪",
              "tree_json": "{\\"element\\":\\"悪\\",\\"g\\":[{\\"element\\":\\"亜\\",\\"g\\":[{\\"element\\":\\"二\\",\\"g\\":[{\\"element\\":\\"一\\"}]},{\\"element\\":\\"口\\"},{\\"element\\":\\"二\\"}]},{\\"element\\":\\"心\\"}]}"
          }
        ]`,
      ),
    );
});
