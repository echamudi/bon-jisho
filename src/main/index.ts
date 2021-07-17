import * as path from 'path';
import { format as formatUrl } from 'url';
import { app, BrowserWindow, ipcMain, shell} from 'electron';
import * as db from 'Main/db';
import * as os from 'os';

declare const __static: string;

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null;

let preloadPath: string;

if (isDevelopment) {
  preloadPath = path.resolve(__static, '../src/preload/preload.js');
} else {
  preloadPath = path.join(__static, '/pre.asar/preload.js');
}

const createMainWindow = () => {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 850,
    height: 600,
    minWidth: 620,
    minHeight: 350,
    titleBarStyle: 'hiddenInset',
    frame: false,
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

app.on('browser-window-blur', (_event, browserWindow: BrowserWindow) => {
  browserWindow.webContents.send('browser-window-blur', null);
});

app.on('browser-window-focus', (_event, browserWindow) => {
  browserWindow.webContents.send('browser-window-focus', null);
});

/**
 * Communication
 */

const platform = os.platform();

ipcMain.handle(
  'get-platform',
  async () => platform,
);

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

let windowPositionI = 0;
let windowPositionCol = 0;

ipcMain.handle(
  'open-url-electron',
  async (_event, message) => {
    // const focusedWindow = BrowserWindow.getFocusedWindow();
    // const [x, y] = focusedWindow?.getPosition() ?? [100, 100];

    // Reset popup birth location if there's no other popups
    const windows = BrowserWindow.getAllWindows();
    if (windows.length === 1) {
      windowPositionI = 0;
      windowPositionCol = 0;
    }

    const windowPop = new BrowserWindow({
      x: 40 + (windowPositionI * 35) + (windowPositionCol * 40),
      y: 40 + (windowPositionI * 35),
      width: 600,
      height: 550,
      minWidth: 300,
      minHeight: 350,
      titleBarStyle: 'hiddenInset',
      frame: false,
      webPreferences: {
        nodeIntegration: false,
        enableRemoteModule: false,
        contextIsolation: true,
        sandbox: true,
        preload: preloadPath,
      },
    });

    if (isDevelopment) {
      const url = 'http://localhost:4200/' + message.url;
      windowPop.loadURL(url);
    } else {
      const url = __static + '/ng.asar/index.html';
      windowPop.loadURL(formatUrl({
        pathname: url,
        protocol: 'file',
        slashes: true,
      }) + message.url);
    }

    // Slighyly move window position
    windowPositionI += 1;
    if (windowPositionI >= 6) {
      windowPositionI = 0;
      windowPositionCol += 1;
    };

    if (windowPositionCol >= 5) {
      windowPositionCol = 0;
    };
  },
);

// DB connection
Object.keys(db).forEach((methodName) => {
  ipcMain.handle(
    methodName,
    // @ts-ignore
    async (event, message) => db[methodName](message),
  );
});
