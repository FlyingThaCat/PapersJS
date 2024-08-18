import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { getAppUserDataDir } from '../storage/filesystem'
import fs from 'fs'
import { initDatabase, insertImage } from '../storage/db'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    titleBarStyle: 'hidden',
    frame: false,
    autoHideMenuBar: true,
    resizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const checkIfDatabaseExists = async () => {
  const dbPath = join(getAppUserDataDir(), 'Database', 'appData.db')
  if (!fs.existsSync(dbPath)) {
    const db = initDatabase()
    db.close()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('db-insert-image', async (_, searchQuery, source, type) => {
    try {
      const db = initDatabase()
      insertImage(db, searchQuery, source, type)
    } catch (error) {
      console.error('Database operation error:', error)
    }
  })

  ipcMain.handle('db-get-images', async () => {
    try {
      const db = initDatabase()
      return db.prepare('SELECT * FROM images').all()
    } catch (error) {
      console.error('Database operation error:', error)
    }
  })

  ipcMain.handle('db-delete-image', async (_, id) => {
    try {
      const db = initDatabase()
      db.prepare('DELETE FROM images WHERE id = ?').run(id)
    } catch (error) {
      console.error('Database operation error:', error)
    }
  })


  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  checkIfDatabaseExists().then(() => {
  createWindow()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
