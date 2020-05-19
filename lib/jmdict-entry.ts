import { JMdict } from 'japanese-db';
import { KanjiReadingPairs } from 'types/bon-jisho';

export function getAllKanjiReadingPairs(kEles: JMdict.k_ele[], rEles: JMdict.r_ele[]): KanjiReadingPairs {
  const pairs: KanjiReadingPairs = [];

  kEles.forEach(kEle => {
    const kanji = kEle.keb[0];

    rEles.forEach(rEle => {
      const reading = rEle.reb[0];
      let isItApplicable: boolean = false;

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
