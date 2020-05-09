const { contextBridge, ipcRenderer, remote } = require("electron");

contextBridge.exposeInMainWorld(
  "electron",
  {
    ipcRenderer: ipcRenderer
  }
);

ipcRenderer.on('browser-window-blur', (event, args) => {
  window.document.body.classList.add("body_blur");
})

ipcRenderer.on('browser-window-focus', (event, args) => {
  window.document.body.classList.remove("body_blur");
})
