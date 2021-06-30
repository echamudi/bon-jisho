import { getJMdictJsonsRows, getKanjivgTreeRows } from 'Main/db';

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
