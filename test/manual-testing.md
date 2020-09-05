# User Testing

List of tasks to be done by an actual user.

## Word Search

- Typing search
  - The search result MUST be displayed as the user types, no need to press enter.
- Search for anything
  - The user MUST see a link to DuckDuckGo image search.
  - Hovering over the tags MUST show the tooltip of the tag meaning.
- Going back to the word search screen
  - The user MUST see the last visited entry details before the user left.

## Entry Details

### All Pages

- Direct URL
  - Accessing direct URL /#/entry-details/?source=jmdict&id=1000310&kanji=馬酔木&reading=あせぶ MUST show the entry details result
  - Accessing direct URL /#/entry-details/?source=jmdict&id=1290160&kanji=根本&reading=こんぽん MUST show the entry details result
  - Accessing direct URL /#/entry-details/?source=jmdict&id=1234563&kanji=馬酔木&reading=あせぶ MUST NOT produce error
  - Accessing direct URL /#/entry-details/?source=jmnedict&id=5232311&kanji=九段下駅&reading=くだんしたえき MUST show the entry details result
- UI (When used through direct URL)
  - Toolbar MUST be padded correctly to avoid the OS window control button
- UI (When used through component)
  - Toolbar MUST NOT be padded when the component is not near OS window control button
- Open popup button
  - Open popup button in jmdict details MUST open the current details in popup.
  - Open popup button in jmnedict details MUST open the current details in popup.
  - Open popup button in empty page details MUST be disabled.
- Behaviour
  - Back and forward buttons 
    - Back and forward buttons MUST work as the user expected.
  - Explore Buttons
    - The search images button MUST be clickable.
    - The search sentences in weblio MUST be clickable.
### Special Features on Some Pages
- 根本 ねもと　1290160
  - Explore other definitions (same writings) MUST be clickable.
  - The "other dictionary items" MUST show only:
    - 根本 ねもと Nemoto;
    - 根本 ねほん kabuki script; illustrated kabuki script;
    - 根本 めもと Memoto;
  - Copy button MUST copy 根本
- 根本 ねほん
  - The 絵入根本 text in "illustrated kabuki script; (abbreviation) See: 絵入根本" MUST be clickable.
- 星鴉
  - The alternative reading and writing links MUST redirect to the corresponding pages.
- 阿呆陀羅
  - The page must show "type of fast-paced humorous..." as only あほだら reading
- 憐れむ
  - The page must show "to enjoy the beauty of; to appreciate..." as only 哀れむ writing
- 家町江良
  - The user MUST see a button linking to Google Maps.
- 鳥取 とっとり
  - The user MUST see a button linking to Google Maps.
- 鳥取 ととり
  - The user MUST NOT see a button linking to Google Maps.
- 絵入り根本
  - It MUST only show one alternative, which is 絵入根本 えいりねほん
- 絵入根本
  - It MUST only show one alternative, which is 絵入り根本 えいりねほん
- 馬珂貝 ばかがい
  - Alternative Writings and Readings MUST show these items only:
    - バカ貝
    - 馬鹿貝
    - バカガイ
- ありがとうさん
  - MUST show the page
  - Copy button MUST copy ありがとうさん
