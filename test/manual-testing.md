# User Testing

List of tasks to be done by an actual user.

## Word Search

- Typing search
  - The search result MUST be displayed as the user types, no need to press enter.
- Search for anything
  - The user MUST see a link to DuckDuckGo image search.
  - Hovering over the tags MUST show the tooltip of the tag meaning.
- Search for 家町江良
  - The user MUST see a button linking to Google Maps.
- Search for 鳥取 とっとり
  - The user MUST see a button linking to Google Maps.
- Search for 鳥取 ととり
  - The user MUST NOT see a button linking to Google Maps.
- Going back to the word search screen
  - The user MUST see the last visited entry details before the user left.

## Entry Details
- Back and forward buttons 
  - Back and forward buttons MUST work as the user expected.
- Direct URL
  - Accessing direct URL /#/entry-details/?source=jmdict&id=1000310&kanji=馬酔木&reading=あせぶ MUST show the entry details result
  - Accessing direct URL /#/entry-details/?source=jmdict&id=1290160&kanji=根本&reading=こんぽん MUST show the entry details result
  - Accessing direct URL /#/entry-details/?source=jmdict&id=1234563&kanji=馬酔木&reading=あせぶ MUST NOT produce error
  - Accessing direct URL /#/entry-details/?source=jmnedict&id=5232311&kanji=九段下駅&reading=くだんしたえき MUST show the entry details result
- UI (When used through direct URL)
  - Toolbar MUST be padded correctly to avoid the OS window control button
- UI (When used through component)
  - Toolbar MUST NOT be padded when the component is not near OS window control button
- Explore Buttons
  - The search images button MUST be clickable.
  - The search sentences in weblio MUST be clickable.
