import { BrowserWindow, ipcMain } from 'electron'
import preloader from '../../../../resources/preloaders/GettyImages.js?asset'
import { USERAGENT } from '../../../const/constant'

let gettyImages: BrowserWindow | null = null
let isGettyImagesWindowOpen = false

const createGettyImagesWindow = () => {
  console.log("IMCALLED")
  if (gettyImages || isGettyImagesWindowOpen) return

  isGettyImagesWindowOpen = true

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

  gettyImages.on('closed', () => {
    gettyImages = null
    isGettyImagesWindowOpen = false
  })
}

ipcMain.on('spawn-gettyImages', () => {
  console.log("IMCALLEDBYIPC")
  createGettyImagesWindow()
})
ipcMain.on('despawn-gettyImages', (event, cookie) => {
  if (gettyImages) {
    gettyImages.close()
  }
})

export { createGettyImagesWindow }
