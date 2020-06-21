const assert = require('assert');
const {
  getJMdictJsonsRows,
} = require('./db');

describe('Database Driver', () => {
  it('getJMdictJsonsRows works', () => {
    getJMdictJsonsRows({
      entSeqs: [1639300, 1639360],
    })
      .then((res) => {
        // @ts-ignore
        assert.deepStrictEqual(
          res,
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
});
