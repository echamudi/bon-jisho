/* eslint-disable import/no-extraneous-dependencies */

import * as path from 'path';
import { format as formatUrl } from 'url';

const {
  app, BrowserWindow, ipcMain, shell,
} = require('electron');

const db = require('./db');

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createMainWindow = () => {
  /** @type {string} */
  let preloadPath;

  if (isDevelopment) {
    preloadPath = path.resolve(__static, '../src/preload/preload.js');
  } else {
    preloadPath = path.join(__static, '/pre.asar/preload.js');
  }

  // Create the browser window.
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 620,
    minHeight: 350,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      sandbox: true,
      preload: preloadPath,
    },
  });

  if (isDevelopment) {
    window.webContents.openDevTools({ mode: 'detach' });
  }

  if (isDevelopment) {
    // window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
    window.loadURL('http://localhost:4200');
  } else {
    window.loadURL(formatUrl({
      pathname: path.join(__static, '/ng.asar/index.html'),
      protocol: 'file',
      slashes: true,
    }));
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
};

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.allowRendererProcessReuse = true;

app.on('browser-window-blur', (event, browserWindow) => {
  browserWindow.webContents.send('browser-window-blur', null);
});

app.on('browser-window-focus', (event, browserWindow) => {
  browserWindow.webContents.send('browser-window-focus', null);
});

/**
 * Communication
 */

ipcMain.handle(
  'toggle-maximize',
  async () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow === null) return;

    if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
    } else {
      focusedWindow.maximize();
    }
  },
);

ipcMain.handle('openURL', async (_event, message) => {
  shell.openExternal(message.url);
});

// DB connection
Object.keys(db).forEach((methodName) => {
  ipcMain.handle(
    methodName,
    async (event, message) => db[methodName](message),
  );
});
