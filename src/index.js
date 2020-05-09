const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: true,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/ng-dist/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: 'detach' });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
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
