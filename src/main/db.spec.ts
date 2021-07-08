import { getJMdictJsonsRows, getKanjiAliveRows, getKanjidicRows, getKanjiQuickDataRows, getKanjivgTreeRows, getRelatedKanjiAggregateRows } from 'Main/db';

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
      JSON.parse(`[{
        "sort": 2652,
        "literal": "夢",
        "jis208": "1-44-20",
        "jis212": null,
        "jis213": null,
        "ucs": "5922",
        "rad_classical": 36,
        "rad_nelson_c": 140,
        "grade": 5,
        "stroke_count": 13,
        "variant": [{
            "var_type": "jis208",
            "$t": "1-52-77"
        }, {
            "var_type": "jis212",
            "$t": "1-24-73"
        }],
        "freq": 943,
        "rad_name": null,
        "jlpt": 2,
        "dic_number": [{
            "dr_type": "nelson_c",
            "$t": "4028"
        }, {
            "dr_type": "nelson_n",
            "$t": "1131"
        }, {
            "dr_type": "halpern_njecd",
            "$t": "2336"
        }, {
            "dr_type": "halpern_kkd",
            "$t": "2939"
        }, {
            "dr_type": "halpern_kkld",
            "$t": "1510"
        }, {
            "dr_type": "halpern_kkld_2ed",
            "$t": "2046"
        }, {
            "dr_type": "heisig",
            "$t": "305"
        }, {
            "dr_type": "heisig6",
            "$t": "327"
        }, {
            "dr_type": "gakken",
            "$t": "969"
        }, {
            "dr_type": "oneill_names",
            "$t": "1990"
        }, {
            "dr_type": "oneill_kk",
            "$t": "1425"
        }, {
            "dr_type": "moro",
            "m_vol": "3",
            "m_page": "0361",
            "$t": "5801P"
        }, {
            "dr_type": "henshall",
            "$t": "1844"
        }, {
            "dr_type": "sh_kk",
            "$t": "811"
        }, {
            "dr_type": "sh_kk2",
            "$t": "830"
        }, {
            "dr_type": "jf_cards",
            "$t": "444"
        }, {
            "dr_type": "henshall3",
            "$t": "816"
        }, {
            "dr_type": "tutt_cards",
            "$t": "783"
        }, {
            "dr_type": "kanji_in_context",
            "$t": "800"
        }, {
            "dr_type": "kodansha_compact",
            "$t": "407"
        }, {
            "dr_type": "maniette",
            "$t": "311"
        }],
        "query_code": [{
            "qc_type": "skip",
            "$t": "2-3-10"
        }, {
            "qc_type": "sh_desc",
            "$t": "3k10.14"
        }, {
            "qc_type": "four_corner",
            "$t": "4420.7"
        }, {
            "qc_type": "deroo",
            "$t": "1960"
        }, {
            "qc_type": "skip",
            "skip_misclass": "posn",
            "$t": "2-8-5"
        }],
        "reading": [{
            "r_type": "pinyin",
            "$t": "meng4"
        }, {
            "r_type": "korean_r",
            "$t": "mong"
        }, {
            "r_type": "korean_h",
            "$t": "몽"
        }, {
            "r_type": "vietnam",
            "$t": "Mộng"
        }, {
            "r_type": "vietnam",
            "$t": "Mông"
        }, {
            "r_type": "ja_on",
            "$t": "ム"
        }, {
            "r_type": "ja_on",
            "$t": "ボウ"
        }, {
            "r_type": "ja_kun",
            "$t": "ゆめ"
        }, {
            "r_type": "ja_kun",
            "$t": "ゆめ.みる"
        }, {
            "r_type": "ja_kun",
            "$t": "くら.い"
        }],
        "meaning": ["dream", "vision", "illusion"],
        "nanori": null
    }]`)
    );

    const res2 = await getKanjidicRows({ kanjiChars: ['A', 'B'] });
    expect(res2).toEqual([]);
});


test('getKanjivgTreeRows', async () => {
  const res = await getKanjivgTreeRows({ kanjiChars: ['悪', '夢', '悪', '化'] });

  expect(res)
    .toEqual(
      JSON.parse(
        `[{
          "kanji": "化",
          "tree_json": {
              "element": "化",
              "g": [{
                  "element": "亻"
              }, {
                  "element": "匕"
              }]
          }
      }, {
          "kanji": "夢",
          "tree_json": {
              "element": "夢",
              "g": [{
                  "g": [{
                      "element": "艹"
                  }, {
                      "element": "罒"
                  }, {
                      "element": "冖"
                  }]
              }, {
                  "element": "夕"
              }]
          }
      }, {
          "kanji": "悪",
          "tree_json": {
              "element": "悪",
              "g": [{
                  "element": "亜",
                  "g": [{
                      "element": "二",
                      "g": [{
                          "element": "一"
                      }]
                  }, {
                      "element": "口"
                  }, {
                      "element": "二"
                  }]
              }, {
                  "element": "心"
              }]
          }
      }]`,
      ),
    );

  const res2 = await getKanjivgTreeRows({ kanjiChars: ['A', 'B'] });
  expect(res2).toEqual([]);
});

test('getRelatedKanjiAggregateRows', async () => {
  const res = await getRelatedKanjiAggregateRows({ kanjiChars: ['悪', '夢', '悪', '化'] });

  expect(res)
    .toEqual(
      JSON.parse(
        `[
          {
            "literal": "化",
            "related_antonyms": null,
            "related_lookalikes": null,
            "related_synonyms": null,
            "related_variants": [
              ""
            ]
          },
          {
            "literal": "夢",
            "related_antonyms": null,
            "related_lookalikes": null,
            "related_synonyms": null,
            "related_variants": [
              "梦"
            ]
          },
          {
            "literal": "悪",
            "related_antonyms": [
              "善",
              "美",
              "好",
              "良"
            ],
            "related_lookalikes": null,
            "related_synonyms": [
              "醜",
              "粗",
              "憎"
            ],
            "related_variants": [
              "惡"
            ]
          }
        ]`,
      ),
    );
});

test('getKanjiQuickDataRows', async () => {
  const res = await getKanjiQuickDataRows({ kanjiChars: ['悪', '夢', '悪', '化'] });

  expect(res)
    .toEqual(
      JSON.parse(
        `[
          {
            "literal": "化",
            "kanken": 80,
            "jlpt_new": 3,
            "on": [
              "カ",
              "ケ"
            ],
            "kun": [
              "ば.ける",
              "ば.かす",
              "ふ.ける",
              "け.する"
            ],
            "meaning": [
              "change",
              "take the form of",
              "influence",
              "enchant",
              "delude",
              "-ization"
            ]
          },
          {
            "literal": "夢",
            "kanken": 60,
            "jlpt_new": 3,
            "on": [
              "ム",
              "ボウ"
            ],
            "kun": [
              "ゆめ",
              "ゆめ.みる",
              "くら.い"
            ],
            "meaning": [
              "dream",
              "vision",
              "illusion"
            ]
          },
          {
            "literal": "悪",
            "kanken": 80,
            "jlpt_new": 4,
            "on": [
              "アク",
              "オ"
            ],
            "kun": [
              "わる.い",
              "わる-",
              "あ.し",
              "にく.い",
              "-にく.い",
              "ああ",
              "いずくに",
              "いずくんぞ",
              "にく.む"
            ],
            "meaning": [
              "bad",
              "vice",
              "rascal",
              "false",
              "evil",
              "wrong"
            ]
          }
        ]`,
      ),
    );
});

test('getKanjiAliveRows', async () => {
  const res = await getKanjiAliveRows({ kanjiChars: ['悪', '夢', '悪', '化'] });

  console.log(JSON.stringify(res, undefined, 2));
  expect(res)
    .toEqual(
      JSON.parse(
        `[
          {
            "kanji": "化",
            "kname": "ba(keru)",
            "kstroke": 4,
            "kmeaning": "change into",
            "kgrade": 3,
            "kunyomi_ja": "ば、ばける、ばかす",
            "kunyomi": "ba, bakeru, bakasu",
            "onyomi_ja": "カ、ケ",
            "onyomi": "ka, ke",
            "examples": [
              [
                "変化する（へんかする）",
                "change [v.i.]"
              ],
              [
                "強化する（きょうかする）",
                "strengthen"
              ],
              [
                "悪化する（あっかする）",
                "grow worse"
              ],
              [
                "消化する（しょうかする）",
                "digest"
              ],
              [
                "近代化する（きんだいかする）",
                "modernize"
              ],
              [
                "映画化する（えいがかする）",
                "adapt (a book) to film"
              ],
              [
                "化学（かがく）",
                "chemistry"
              ],
              [
                "化粧品（けしょうひん）",
                "cosmetics"
              ],
              [
                "化ける（ばける）",
                "appear in disguise [v.i.]"
              ],
              [
                "お化け（おばけ）",
                "ghost"
              ],
              [
                "化かす（ばかす）",
                "bewitch [v.t.]"
              ]
            ],
            "radical": "⼔",
            "rad_order": 26,
            "rad_stroke": 2,
            "rad_name_ja": "さじ",
            "rad_name": "saji",
            "rad_meaning": "spoon",
            "rad_position_ja": "つくり",
            "rad_position": "tsukuri"
          },
          {
            "kanji": "夢",
            "kname": "yume",
            "kstroke": 13,
            "kmeaning": "dream",
            "kgrade": 5,
            "kunyomi_ja": "ゆめ",
            "kunyomi": "yume",
            "onyomi_ja": "ム",
            "onyomi": "mu",
            "examples": [
              [
                "夢中で（むちゅうで）",
                "be absorbed, be engrossed"
              ],
              [
                "夢想家（むそうか）",
                "dreamer"
              ],
              [
                "悪夢（あくむ）",
                "nightmare"
              ],
              [
                "夢（ゆめ）",
                "dream [n.]"
              ],
              [
                "初夢（はつゆめ）",
                "first dream of the year"
              ],
              [
                "正夢（まさゆめ）",
                "dream that comes true"
              ]
            ],
            "radical": "⼣",
            "rad_order": 42,
            "rad_stroke": 3,
            "rad_name_ja": "ゆうべ",
            "rad_name": "yuube",
            "rad_meaning": "evening",
            "rad_position_ja": null,
            "rad_position": null
          },
          {
            "kanji": "悪",
            "kname": "waru(i)",
            "kstroke": 11,
            "kmeaning": "bad, evil",
            "kgrade": 3,
            "kunyomi_ja": "わる、あ、わるい、わるさ、あし、あしき",
            "kunyomi": "waru, a, warui, warusa, ashi, ashiki",
            "onyomi_ja": "アク、オ",
            "onyomi": "aku, o",
            "examples": [
              [
                "悪魔（あくま）",
                "devil"
              ],
              [
                "悪事（あくじ）",
                "evil deed"
              ],
              [
                "最悪（さいあく）",
                "the worst"
              ],
              [
                "悪条件（あくじょうけん）",
                "unfavorable conditions"
              ],
              [
                "悪化する（あっかする）",
                "get worse [v.i.]"
              ],
              [
                "悪寒（おかん）",
                "chill"
              ],
              [
                "悪い（わるい）",
                "bad"
              ],
              [
                "悪口（わるくち）",
                "slander, abuse [n.]"
              ],
              [
                "悪しからず（あしからず）",
                "don't get me wrong, but ..."
              ],
              [
                "善し悪し（よしあし）",
                "good or bad"
              ]
            ],
            "radical": "⼼",
            "rad_order": 80,
            "rad_stroke": 4,
            "rad_name_ja": "こころ",
            "rad_name": "kokoro",
            "rad_meaning": "heart, mind, spirit",
            "rad_position_ja": null,
            "rad_position": null
          }
        ]`,
      ),
    );
});
