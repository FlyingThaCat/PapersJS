import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { getAppUserDataDir } from '../storage/filesystem'
import fs from 'fs'
import { addSearch, initDatabase, updateInterval } from '../storage/db'
import { searchImages } from '../providers/GettyImages/main'
import { fetchAndUpdateCookie } from '../services/fetchCookie'
import { fetchAndSetWallpaper } from '../services/fetchAndSetWallpaper'
import { j } from 'vite/dist/node/types.d-aGj9QkWt'

// Track the interval ID
let wallpaperInterval: NodeJS.Timeout | null = null

const getUpdateInterval = () => {
  const db = initDatabase()
  const result = db.prepare('SELECT updateInterval FROM settings').get()
  return result ? result.updateInterval * 1000 : 300000 // Default to 5 minutes if not set
}

const updateWallpaperInterval = () => {
  if (wallpaperInterval) {
    clearInterval(wallpaperInterval)
  }
  const interval = getUpdateInterval()
  wallpaperInterval = setInterval(fetchAndSetWallpaper, interval)
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    ...(process.platform === 'darwin' ? { titleBarStyle: 'hidden', frame: false } : {}),
    autoHideMenuBar: true,
    resizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    icon: join(__dirname, '../../resources/icon.png'),
    title: 'PapersJS'
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    fetchAndSetWallpaper()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('close', (event) => {
    event.preventDefault() // Prevent the window from quitting
    mainWindow.hide() // Hide the window instead
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  app.on('before-quit', () => {
    // Perform any cleanup or save data if necessary
    // Your app-specific logic here

    // Close the main window gracefully
    tray.destroy()
    mainWindow.destroy()
  })
}

const checkIfDatabaseExists = async () => {
  const dbPath = join(getAppUserDataDir(), 'Database', 'appData.db')
  if (fs.existsSync(dbPath)) {
    try {
      const db = await initDatabase()
      db.close()
    } catch (error) {
      console.error('Failed to initialize or close the database:', error)
    }
  }
}

let tray

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  tray = new Tray(nativeImage.createEmpty())
  const contextMenu = Menu.buildFromTemplate([
    // { label: 'Next Wallpaper', click: () => fetchAndSetWallpaper()},
    { role: 'quit' }
  ])
  tray.setToolTip('PapersJS')
  tray.setContextMenu(contextMenu)

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('db-add-search', async (_, searchQuery, source, type) => {
    try {
      const db = initDatabase()
      addSearch(db, searchQuery, source, type)
    } catch (error) {
      console.error('Database operation error:', error)
    }
  })

  ipcMain.handle('db-get-search', async () => {
    try {
      const db = initDatabase()
      return db.prepare('SELECT * FROM search').all()
    } catch (error) {
      console.error('Database operation error:', error)
    }
  })

  ipcMain.handle('db-delete-search', async (_, id) => {
    try {
      const db = initDatabase()
      db.prepare('DELETE FROM search WHERE id = ?').run(id)
    } catch (error) {
      console.error('Database operation error:', error)
    }
  })

  ipcMain.handle('db-update-interval', async (_, interval) => {
    try {
      // do conversion here 5s -> 5, 5m -> 300, 5h -> 18000
      if (interval.endsWith('s')) {
        interval = parseInt(interval.replace('s', ''))
      } else if (interval.endsWith('m')) {
        interval = parseInt(interval.replace('m', '')) * 60
      } else if (interval.endsWith('h')) {
        interval = parseInt(interval.replace('h', '')) * 60 * 60
      } else {
        // default to 5 minutes
        interval = 300
      }

      const db = initDatabase()
      db.prepare('UPDATE settings SET updateInterval = ?').run(interval)
      updateWallpaperInterval()
    } catch (error) {
      console.error('Database operation error:', error)
    }
  })

  ipcMain.handle('db-get-settings', async () => {
    try {
      const db = initDatabase()
      return db.prepare('SELECT * FROM settings').get()
    } catch (error) {
      console.error('Database operation error:', error)
    }
  })

  ipcMain.handle('getty-images-search', async (_, query, type) => {
    try {
      console.log('Getty Images search query:', query, type)
      const result = searchImages(query, type)
      console.log('Getty Images search result:', result)
    } catch (error) {
      console.error('Getty Images search error:', error)
    }
  })

  ipcMain.handle('insert-new-cookie', async (_, provider, cookie) => {
    try {
      const db = initDatabase()

      // Insert the new cookie or replace the existing one
      const insertQuery = db.prepare(`
        INSERT OR REPLACE INTO cookies (provider, cookie) VALUES (?, ?)
      `)

      insertQuery.run(provider, cookie)
    } catch (error) {
      console.error('Database operation error:', error)
    }
  })

  ipcMain.handle('get-cookie', async (_, provider) => {
    try {
      const db = initDatabase()
      const query = db.prepare('SELECT cookie FROM cookies WHERE provider = ?')
      return query.get(provider)
    } catch (error) {
      console.error('Database operation error:', error)
    }
  })

  ipcMain.handle('fetch-cookies', () => {
    try {
      console.log('Bonked')
      fetchAndUpdateCookie()
    } catch (error) {
      console.error('Error fetching provider:', error)
    }
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  checkIfDatabaseExists().then(() => {
    updateInterval(initDatabase())
    updateWallpaperInterval()
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
