import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { getCookie, initDatabase } from '../storage/db'
import { getAppTempDir } from '../storage/filesystem'
import { webContents } from 'electron'
import { USERAGENT } from '../const/constant'

const fetchAndSetWallpaper = async () => {
  try {
    const wallpaperModulePath = path.resolve(__dirname, 'node_modules', 'wallpaper')
      .replace('app.asar', 'app.asar.unpacked')
      .replace(`out\\main\\`, '');
    const wallpaperModuleUrl = `file://${wallpaperModulePath.replace(/\\/g, '/')}/index.js`;
    const { setWallpaper } = await import(wallpaperModuleUrl);
    // const { setWallpaper } = await import('wallpaper')
    const db = initDatabase()

    // Fetch the next wallpaper URL from the database
    const result = db
      .prepare(
        `
      SELECT id, url FROM wallpapers 
      ORDER BY last_used ASC LIMIT 1
    `
      )
      .get()
    if (!result || !result.url) {
      return
    }

    const { id, url } = result
    if (url) {
      // Download the wallpaper image to a temporary directory
      const response = await axios.get(url, {
        responseType: 'stream',
        headers: {
          Cookie: getCookie('Getty Images').cookie,
          'User-Agent': USERAGENT
        }
      })
      const tempDir = getAppTempDir()
      const idurl = url.split('/')[4]
      if (!fs.existsSync(path.join(tempDir, `/PapersJS/`))) {
        fs.mkdirSync(path.join(tempDir, `/PapersJS/`), { recursive: true })
      }
      const tempPath = path.join(tempDir, `/PapersJS/`, `wallpaper_${idurl}.jpg`)

      response.data.pipe(fs.createWriteStream(tempPath))

      // Wait for the download to complete
      await new Promise((resolve, reject) => {
        response.data.on('end', resolve)
        response.data.on('error', reject)
      })

      console.log(`Wallpaper downloaded to: ${tempPath}`)
      // Set the wallpaper
      await setWallpaper(tempPath)
      webContents.getAllWebContents().forEach((content) => {
        content.send('update-current-wallpaper', { url, id })
      })

      // Update the last_used field in the database
      const now = new Date().toISOString()
      db.prepare('UPDATE wallpapers SET last_used = ? WHERE id = ?').run(now, id)

      console.log(`Wallpaper set to: ${url}`)
    } else {
      console.log('No wallpapers found in the database')
    }
  } catch (error) {
    console.error('Failed to fetch and set wallpaper:', error)
  }
}

export { fetchAndSetWallpaper }
