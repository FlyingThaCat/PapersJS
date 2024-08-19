import { BrowserWindow, ipcMain } from 'electron'
import preloader from '../../../../resources/preloaders/GettyImages.js?asset'
import { USERAGENT } from '../../../const/constant'

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
    userAgent: USERAGENT
  })

  gettyImages.on('closed', () => (gettyImages = null))
}

ipcMain.on('spawn-gettyImages', () => createGettyImagesWindow())
ipcMain.on('despawn-gettyImages', (event, cookie) => {
  if (gettyImages) {
      gettyImages.close()
  }
})

export { createGettyImagesWindow }
