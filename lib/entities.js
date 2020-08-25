/**
 * @typedef { import("types/bon-jisho").DictSource } DictSource
 */

/** */

import * as c from './const';

/** @type {Record<string, string>} */
export const JMdictEntities = JSON.parse(`
{
  "X": "rude or X-rated term (not displayed in educational software)",
  "MA": "martial arts term",
  "abbr": "abbreviation",
  "adj-i": "adjective (keiyoushi)",
  "adj-ix": "adjective (keiyoushi) - yoi/ii class",
  "adj-na": "adjectival nouns or quasi-adjectives (keiyodoshi)",
  "adj-no": "nouns which may take the genitive case particle 'no'",
  "adj-pn": "pre-noun adjectival (rentaishi)",
  "adj-t": "'taru' adjective",
  "adj-f": "noun or verb acting prenominally",
  "adv": "adverb (fukushi)",
  "adv-to": "adverb taking the 'to' particle",
  "arch": "archaism",
  "ateji": "ateji (phonetic) reading",
  "aux": "auxiliary",
  "aux-v": "auxiliary verb",
  "aux-adj": "auxiliary adjective",
  "Buddh": "Buddhist term",
  "chem": "chemistry term",
  "chn": "children's language",
  "col": "colloquialism",
  "comp": "computer terminology",
  "conj": "conjunction",
  "cop-da": "copula",
  "ctr": "counter",
  "derog": "derogatory",
  "eK": "exclusively kanji",
  "ek": "exclusively kana",
  "exp": "expressions (phrases, clauses, etc.)",
  "fam": "familiar language",
  "fem": "female term or language",
  "food": "food term",
  "geom": "geometry term",
  "gikun": "gikun (meaning as reading) or jukujikun (special kanji reading)",
  "hon": "honorific or respectful (sonkeigo) language",
  "hum": "humble (kenjougo) language",
  "iK": "word containing irregular kanji usage",
  "id": "idiomatic expression",
  "ik": "word containing irregular kana usage",
  "int": "interjection (kandoushi)",
  "io": "irregular okurigana usage",
  "iv": "irregular verb",
  "ling": "linguistics terminology",
  "m-sl": "manga slang",
  "male": "male term or language",
  "male-sl": "male slang",
  "math": "mathematics",
  "mil": "military",
  "n": "noun (common) (futsuumeishi)",
  "n-adv": "adverbial noun (fukushitekimeishi)",
  "n-suf": "noun, used as a suffix",
  "n-pref": "noun, used as a prefix",
  "n-t": "noun (temporal) (jisoumeishi)",
  "num": "numeric",
  "oK": "word containing out-dated kanji",
  "obs": "obsolete term",
  "obsc": "obscure term",
  "ok": "out-dated or obsolete kana usage",
  "oik": "old or irregular kana form",
  "on-mim": "onomatopoeic or mimetic word",
  "pn": "pronoun",
  "poet": "poetical term",
  "pol": "polite (teineigo) language",
  "pref": "prefix",
  "proverb": "proverb",
  "prt": "particle",
  "physics": "physics terminology",
  "quote": "quotation",
  "rare": "rare",
  "sens": "sensitive",
  "sl": "slang",
  "suf": "suffix",
  "uK": "word usually written using kanji alone",
  "uk": "word usually written using kana alone",
  "unc": "unclassified",
  "yoji": "yojijukugo",
  "v1": "Ichidan verb",
  "v1-s": "Ichidan verb - kureru special class",
  "v2a-s": "Nidan verb with 'u' ending (archaic)",
  "v4h": "Yodan verb with 'hu/fu' ending (archaic)",
  "v4r": "Yodan verb with 'ru' ending (archaic)",
  "v5aru": "Godan verb - -aru special class",
  "v5b": "Godan verb with 'bu' ending",
  "v5g": "Godan verb with 'gu' ending",
  "v5k": "Godan verb with 'ku' ending",
  "v5k-s": "Godan verb - Iku/Yuku special class",
  "v5m": "Godan verb with 'mu' ending",
  "v5n": "Godan verb with 'nu' ending",
  "v5r": "Godan verb with 'ru' ending",
  "v5r-i": "Godan verb with 'ru' ending (irregular verb)",
  "v5s": "Godan verb with 'su' ending",
  "v5t": "Godan verb with 'tsu' ending",
  "v5u": "Godan verb with 'u' ending",
  "v5u-s": "Godan verb with 'u' ending (special class)",
  "v5uru": "Godan verb - Uru old class verb (old form of Eru)",
  "vz": "Ichidan verb - zuru verb (alternative form of -jiru verbs)",
  "vi": "intransitive verb",
  "vk": "Kuru verb - special class",
  "vn": "irregular nu verb",
  "vr": "irregular ru verb, plain form ends with -ri",
  "vs": "noun or participle which takes the aux. verb suru",
  "vs-c": "su verb - precursor to the modern suru",
  "vs-s": "suru verb - special class",
  "vs-i": "suru verb - included",
  "kyb": "Kyoto-ben",
  "osb": "Osaka-ben",
  "ksb": "Kansai-ben",
  "ktb": "Kantou-ben",
  "tsb": "Tosa-ben",
  "thb": "Touhoku-ben",
  "tsug": "Tsugaru-ben",
  "kyu": "Kyuushuu-ben",
  "rkb": "Ryuukyuu-ben",
  "nab": "Nagano-ben",
  "hob": "Hokkaido-ben",
  "vt": "transitive verb",
  "vulg": "vulgar expression or word",
  "adj-kari": "'kari' adjective (archaic)",
  "adj-ku": "'ku' adjective (archaic)",
  "adj-shiku": "'shiku' adjective (archaic)",
  "adj-nari": "archaic/formal form of na-adjective",
  "n-pr": "proper noun",
  "v-unspec": "verb unspecified",
  "v4k": "Yodan verb with 'ku' ending (archaic)",
  "v4g": "Yodan verb with 'gu' ending (archaic)",
  "v4s": "Yodan verb with 'su' ending (archaic)",
  "v4t": "Yodan verb with 'tsu' ending (archaic)",
  "v4n": "Yodan verb with 'nu' ending (archaic)",
  "v4b": "Yodan verb with 'bu' ending (archaic)",
  "v4m": "Yodan verb with 'mu' ending (archaic)",
  "v2k-k": "Nidan verb (upper class) with 'ku' ending (archaic)",
  "v2g-k": "Nidan verb (upper class) with 'gu' ending (archaic)",
  "v2t-k": "Nidan verb (upper class) with 'tsu' ending (archaic)",
  "v2d-k": "Nidan verb (upper class) with 'dzu' ending (archaic)",
  "v2h-k": "Nidan verb (upper class) with 'hu/fu' ending (archaic)",
  "v2b-k": "Nidan verb (upper class) with 'bu' ending (archaic)",
  "v2m-k": "Nidan verb (upper class) with 'mu' ending (archaic)",
  "v2y-k": "Nidan verb (upper class) with 'yu' ending (archaic)",
  "v2r-k": "Nidan verb (upper class) with 'ru' ending (archaic)",
  "v2k-s": "Nidan verb (lower class) with 'ku' ending (archaic)",
  "v2g-s": "Nidan verb (lower class) with 'gu' ending (archaic)",
  "v2s-s": "Nidan verb (lower class) with 'su' ending (archaic)",
  "v2z-s": "Nidan verb (lower class) with 'zu' ending (archaic)",
  "v2t-s": "Nidan verb (lower class) with 'tsu' ending (archaic)",
  "v2d-s": "Nidan verb (lower class) with 'dzu' ending (archaic)",
  "v2n-s": "Nidan verb (lower class) with 'nu' ending (archaic)",
  "v2h-s": "Nidan verb (lower class) with 'hu/fu' ending (archaic)",
  "v2b-s": "Nidan verb (lower class) with 'bu' ending (archaic)",
  "v2m-s": "Nidan verb (lower class) with 'mu' ending (archaic)",
  "v2y-s": "Nidan verb (lower class) with 'yu' ending (archaic)",
  "v2r-s": "Nidan verb (lower class) with 'ru' ending (archaic)",
  "v2w-s": "Nidan verb (lower class) with 'u' ending and 'we' conjugation (archaic)",
  "archit": "architecture term",
  "astron": "astronomy, etc. term",
  "baseb": "baseball term",
  "biol": "biology term",
  "bot": "botany term",
  "bus": "business term",
  "econ": "economics term",
  "engr": "engineering term",
  "finc": "finance term",
  "geol": "geology, etc. term",
  "law": "law, etc. term",
  "mahj": "mahjong term",
  "med": "medicine, etc. term",
  "music": "music term",
  "Shinto": "Shinto term",
  "shogi": "shogi term",
  "sports": "sports term",
  "sumo": "sumo term",
  "zool": "zoology term",
  "joc": "jocular, humorous term",
  "anat": "anatomical term"
}
`);

/** @type {Record<string, string>} */
export const JMnedictEntitites = JSON.parse(`
{
  "surname": "family or surname",
  "place": "place name",
  "unclass": "unclassified name",
  "company": "company name",
  "product": "product name",
  "work": "work of art, literature, music, etc. name",
  "masc": "male given name or forename",
  "fem": "female given name or forename",
  "person": "full name of a particular person",
  "given": "given name or forename, gender not specified",
  "station": "railway station",
  "organization": "organization name",
  "ok": "old or irregular kana form"
}
`);

/**
 * - news1/2: appears in the "wordfreq" file compiled by Alexandre Girardi
 * from the Mainichi Shimbun. (See the Monash ftp archive for a copy.)
 * Words in the first 12,000 in that file are marked "news1" and words
 * in the second 12,000 are marked "news2".
 * - ichi1/2: appears in the "Ichimango goi bunruishuu", Senmon Kyouiku
 * Publishing, Tokyo, 1998.  (The entries marked "ichi2" were
 * demoted from ichi1 because they were observed to have low
 * frequencies in the WWW and newspapers.)
 * - spec1 and spec2: a small number of words use this marker when they
 * are detected as being common, but are not included in other lists.
 * - gai1/2: common loanwords, based on the wordfreq file.
 * - nfxx: this is an indicator of frequency-of-use ranking in the
 * wordfreq file. "xx" is the number of the set of 500 words in which
 * the entry can be found, with "01" assigned to the first 500, "02"
 * to the second, and so on. (The entries with news1, ichi1, spec1, spec2
 * and gai1 values are marked with a "(P)" in the EDICT and EDICT2
 * files.)
 * @type {Record<string, string>} */
export const Priorities = JSON.parse(`
{
  "news1": "This word appears in the first 12,000 words out of 24,000 words from Mainichi Shimbun frequency list.",
  "news2": "This word appears in the second 12,000 words out of 24,000 words from Mainichi Shimbun frequency list.",
  "ichi": "This word appears in 10,000 selected vocabularies collection (Ichimango goi bunruishuu, Senmon Kyouiku).",
  "spec1": "other 1-2000 common words",
  "spec2": "other 2001-4000 common words",
  "gai": "4500 common loanwords"
}
`);

/**
 * Get tag description
 * @param {string} tag
 * @returns {string}
 */
export function getTagDescription(tag) {
  if (Priorities[tag] !== undefined) {
    return Priorities[tag];
  }

  if (tag === 'ichi1' || tag === 'ichi2') {
    return Priorities.ichi;
  }

  if (tag.slice(0, 2) === 'nf') {
    const nf = parseInt(tag.slice(2, 4), 10);

    return `This word is ranked between ${nf * 500 - 499}-${nf * 500} in the Mainichi Shimbun frequency list.`;
  }

  return '';
}

/**
 * @param {string} key
 * @param {DictSource} dict
 * @returns {string}
 */
export function getEntity(key, dict) {
  if (dict === c.JMNEDICT) return JMnedictEntitites[key];
  if (dict === c.JMDICT) return JMdictEntities[key];
  return key;
}

/**
 * @param {string[]} keys
 * @param {DictSource} dict
 * @returns {string[]}
 */
export function getEntities(keys, dict) {
  return keys.map((key) => getEntity(key, dict));
}

/**
 * Check if an array of entities contains keywords indicating a place name.
 * @param {string[]} keys
 * @returns {boolean}
 */
export function isPlace(keys) {
  return keys.some((key) => key === 'place' || key === 'station');
}
