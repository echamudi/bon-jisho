const path = require('path');

// Add __static property to match the electron env
// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
global.__static = path.join(__dirname, '../../static');

const {
  getJMdictJsonsRows,
} = require('./db');

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
