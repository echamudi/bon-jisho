/**
 * @typedef { import("types/bon-jisho").KanjiReadingPairs } KanjiReadingPairs
 * @typedef { import("japanese-db").JMdict.k_ele } JMdict.k_ele
 * @typedef { import("japanese-db").JMdict.r_ele } JMdict.r_ele
 */

const entitiesJMdict = require('./entities-jmdict.json');
const entitiesJMnedict = require('./entities-jmnedict.json');
const c = require('./const');

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

/**
 * Get entity name
 * @param {string} key
 * @param {c.JMDICT|c.JMNEDICT} type c.JMDICT or c.JMNEDICT
 * @returns {string}
 */
function getEntity(key, type) {
  if (type === c.JMDICT) {
    return entitiesJMdict[key];
  }

  if (type === c.JMNEDICT) {
    return entitiesJMnedict[key];
  }

  return key;
}

module.exports = {
  getAllKanjiReadingPairs,
  getEntity,
};
