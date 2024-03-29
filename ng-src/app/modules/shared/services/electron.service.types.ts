import { ipcRenderer } from 'electron';
import { getJMdictJsonsRows, getJMnedictJsonsRows, getDictIndexRows, getDictIndexRow,
  getKanjidicRows, getKanjivgTreeRows, getKanjiQuickDataRows, getWordsByTag, getKanjiGroups } from 'Main/db';

type _ipcRenderer = typeof ipcRenderer;

export interface BonIpcRenderer extends _ipcRenderer {
  invoke(channel: 'getDictIndexRows', query: Parameters<typeof getDictIndexRows>[0]): ReturnType<typeof getDictIndexRows>;
  invoke(channel: 'getDictIndexRow', query: Parameters<typeof getDictIndexRow>[0]): ReturnType<typeof getDictIndexRow>;
  invoke(channel: 'getJMdictJsonsRows', query: Parameters<typeof getJMdictJsonsRows>[0]): ReturnType<typeof getJMdictJsonsRows>;
  invoke(channel: 'getJMnedictJsonsRows', query: Parameters<typeof getJMnedictJsonsRows>[0]): ReturnType<typeof getJMnedictJsonsRows>;
  invoke(channel: 'getKanjidicRows', query: Parameters<typeof getKanjidicRows>[0]): ReturnType<typeof getKanjidicRows>;
  invoke(channel: 'getKanjivgTreeRows', query: Parameters<typeof getKanjivgTreeRows>[0]): ReturnType<typeof getKanjivgTreeRows>;
  invoke(channel: 'getKanjiQuickDataRows', query: Parameters<typeof getKanjiQuickDataRows>[0]): ReturnType<typeof getKanjiQuickDataRows>;
  invoke(channel: 'getWordsByTag', query: Parameters<typeof getWordsByTag>[0]): ReturnType<typeof getWordsByTag>;
  invoke(channel: 'getKanjiGroups'): ReturnType<typeof getKanjiGroups>;
  invoke(channel: 'get-platform'): Promise<string>;
  invoke(channel: 'openURL' | 'open-url-electron', query: { url: string }): Promise<undefined>;
}
