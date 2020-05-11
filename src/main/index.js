import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import * as db from './db';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createMainWindow = () => {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: true,
      contextIsolation: true,
      sandbox: true,
      preload: path.resolve(__static, 'preload.js'),
    },
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  // if (isDevelopment) {
  //   window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  // } else {
  //   window.loadURL(formatUrl({
  //     pathname: path.join(__dirname, 'index.html'),
  //     protocol: 'file',
  //     slashes: true,
  //   }));
  // }

  // console.log(__static);
  // console.log(@);

  window.loadURL(formatUrl({
    pathname: path.join(__static, '/ng-dist/index.html'),
    protocol: 'file',
    slashes: true,
  }));

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

// Communication

ipcMain.handle(
  'get-bon-entries',
  async (event, message) => db.getBonEntries(message),
);

ipcMain.handle(
  'get-details-json',
  async (event, message) => db.getDetailsJson(message),
);

ipcMain.handle(
  'toggle-maximize',
  async () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
    } else {
      focusedWindow.maximize();
    }
  },
);
