import Database from 'better-sqlite3'
import { getAppUserDataDir } from './filesystem'
import { join } from 'path'

const initDatabase = () => {
  const dbPath = join(getAppUserDataDir(), 'Database', 'appData.db')
  const db = new Database(dbPath)

  const searchQuery = `
    CREATE TABLE IF NOT EXISTS search (
      id INTEGER PRIMARY KEY,
      query TEXT NOT NULL UNIQUE,
      provider TEXT NOT NULL,
      type TEXT NOT NULL
    )`
  db.exec(searchQuery)

  const settingsQuery = `
    CREATE TABLE IF NOT EXISTS settings (
  updateInterval INTEGER NOT NULL 
)`
  db.exec(settingsQuery)

  const cookiesQuery = `
    CREATE TABLE IF NOT EXISTS cookies (
      id INTEGER PRIMARY KEY,
      provider TEXT UNIQUE NOT NULL,
      cookie TEXT NOT NULL
    )`
  db.exec(cookiesQuery)

  const wallpapers = `
  CREATE TABLE IF NOT EXISTS wallpapers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  query TEXT NOT NULL,
  last_used DATETIME DEFAULT NULL
)`
  db.exec(wallpapers)

  return db
}

const addSearch = (db, searchQuery, source, type) => {
  try {
    console.log('Inserting image:', searchQuery, source, type)
    const insertQuery = db.prepare('INSERT INTO search (query, provider, type) VALUES (?, ?, ?)')
    const info = insertQuery.run(searchQuery, source, type)
    console.log('Insert Result:', info)
  } catch (error) {
    console.error('Database insertion error:', error)
  }
}

const updateInterval = (db, interval = 300) => {
  try {
    // Check if a row already exists
    const row = db.prepare('SELECT COUNT(*) AS count FROM settings').get()

    if (row.count === 0) {
      // Insert a new row with the default value if no rows exist
      db.prepare('INSERT INTO settings (updateInterval) VALUES (?)').run(interval)
      console.log('Default value inserted:', interval)
    } else {
      // Update the existing row
      db.prepare('UPDATE settings SET updateInterval = ?').run(interval)
      console.log('Update interval set to:', interval)
    }
  } catch (error) {
    console.error('Error setting updateInterval:', error)
  }
}

const getCookie = (provider) => {
  try {
    const db = initDatabase()
    const query = db.prepare('SELECT cookie FROM cookies WHERE provider = ?')
    return query.get(provider)
  } catch (error) {
    console.error('Database operation error:', error)
  }
}

const insertWallpaper = async (url, query) => {
  try {
    const db = initDatabase()
    const insertQuery = db.prepare('INSERT INTO wallpapers (url, query) VALUES (?, ?)')
    insertQuery.run(url, query)
    console.log('Wallpaper inserted:', query, url)
  } catch (error) {
    console.error('Failed to insert wallpaper:', error)
  }
}

export { initDatabase, addSearch, updateInterval, getCookie, insertWallpaper }
