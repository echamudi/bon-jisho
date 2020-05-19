/**
 * @typedef { import("types/bon-jisho").KanjiReadingPairs } KanjiReadingPairs
 * @typedef { import("japanese-db").JMdict.k_ele } JMdict.k_ele
 * @typedef { import("japanese-db").JMdict.r_ele } JMdict.r_ele
 */

/**
 * @param {JMdict.k_ele[]} kEles
 * @param {JMdict.r_ele[]} rEles
 * @returns {KanjiReadingPairs}
 */
function getAllKanjiReadingPairs(kEles, rEles) {
  /** @type {KanjiReadingPairs} */
  const pairs = [];

  kEles.forEach((kEle) => {
    const kanji = kEle.keb[0];

    rEles.forEach((rEle) => {
      const reading = rEle.reb[0];
      /** @type {boolean} */
      let isItApplicable = false;

      if (rEle.re_restr === undefined) {
        isItApplicable = true;
      } else if (rEle.re_restr.includes(kanji)) {
        isItApplicable = true;
      } else {
        isItApplicable = false;
      }

      if (isItApplicable) {
        pairs.push({ kanji, reading });
      }
    });
  });

  return pairs;
}

module.exports = {
  getAllKanjiReadingPairs,
};
