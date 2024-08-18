import { BrowserWindow, ipcMain } from 'electron'
import preloader from '../../../resources/preloaders/GettyImages.js?asset'

let gettyImages: BrowserWindow | null = null

const createGettyImagesWindow = () => {
  if (gettyImages) return

  gettyImages = new BrowserWindow({
    width: 450,
    height: 400,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloader
    }
  })

  gettyImages.loadURL('https://gettyimages.com', {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15'
  })

  gettyImages.on('closed', () => (gettyImages = null))
}

ipcMain.on('spawn-gettyImages', () => createGettyImagesWindow())
ipcMain.on('despawn-gettyImages', (event, message) => {
  if (gettyImages) {
    gettyImages.close()
    console.log('[RECEIVEDMESSAGE]:', message)
  }
})

export { createGettyImagesWindow }
