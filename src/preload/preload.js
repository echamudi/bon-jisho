// eslint-disable-next-line import/no-extraneous-dependencies
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer,
  },
);

ipcRenderer.on('browser-window-blur', () => {
  window.document.body.classList.add('body_blur');
});

ipcRenderer.on('browser-window-focus', () => {
  window.document.body.classList.remove('body_blur');
});
