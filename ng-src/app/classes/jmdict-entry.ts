import { JMdict } from 'japanese-db';

export class JMdictEntry {
  private jmdictEntry: JMdict.entry;

  constructor(jmdictEntry: JMdict.entry) {
    this.jmdictEntry = jmdictEntry;
  }

  getAllKanjiReadingPairs() {
    this.jmdictEntry.k_ele.forEach((kEle) => {
      console.log(kEle.keb);
    })
  }
}
