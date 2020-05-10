import { JMdict } from 'japanese-db-maker';

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
