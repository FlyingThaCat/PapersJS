import Database from 'better-sqlite3'
import { getAppUserDataDir } from './filesystem'
import { join } from 'path'

const initDatabase = () => {
  const dbPath = join(getAppUserDataDir(), 'Database', 'appData.db')
  const db = new Database(dbPath)

  const imagesQuery = `
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY,
      query TEXT NOT NULL UNIQUE,
      provider TEXT NOT NULL,
      type TEXT NOT NULL
    )`
  db.exec(imagesQuery)

  const settingsQuery = `
    CREATE TABLE IF NOT EXISTS settings (
  updateInterval INTEGER NOT NULL DEFAULT 300
)`
  db.exec(settingsQuery)

  return db
}

const insertImage = (db, searchQuery, source, type) => {
  try {
    console.log('Inserting image:', searchQuery, source, type)
    const insertQuery = db.prepare('INSERT INTO images (query, provider, type) VALUES (?, ?, ?)')
    const info = insertQuery.run(searchQuery, source, type)
    console.log('Insert Result:', info)
  } catch (error) {
    console.error('Database insertion error:', error)
  }
}

const updateInterval = (db, interval) => {
  try {
    console.log('Updating interval:', interval)
    const updateQuery = db.prepare('UPDATE settings SET updateInterval = ?')
    const info = updateQuery.run(interval)
    console.log('Update Result:', info)
  } catch (error) {
    console.error('Database update error:', error)
  }
}

export { initDatabase, insertImage, updateInterval }
