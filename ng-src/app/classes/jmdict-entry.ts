import { JMdict } from 'japanese-db';
import { KanjiReadingPairs } from 'types/bon-jisho';

export class JMdictEntry {
  private jmdictEntry: JMdict.entry;

  constructor(jmdictEntry: JMdict.entry) {
    this.jmdictEntry = jmdictEntry;
  }

  getAllKanjiReadingPairs(): KanjiReadingPairs {
    const pairs: KanjiReadingPairs = [];

    this.jmdictEntry.k_ele.forEach(kEle => {
      const kanji = kEle.keb[0];

      this.jmdictEntry.r_ele.forEach(rEle => {
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
          pairs.push({kanji, reading});
        }
      });
    });

    return pairs;
  }
}
