import { createGettyImagesWindow } from '../providers/GettyImages/window/main'
import { initDatabase } from '../storage/db'

const fetchAndUpdateCookie = () => {
  try {
    // Initialize the database connection
    const db = initDatabase()

    // Fetch the distinct provider from the search table
    const { provider } = db.prepare('SELECT DISTINCT provider FROM search').get()

    // Check if the provider already exists in the cookies table
    if (provider) {
      const existingCookie = db.prepare('SELECT 1 FROM cookies WHERE provider = ?').get(provider)

      // If a cookie for this provider is found, do nothing
      if (existingCookie) {
        console.log(`Cookie already exists for provider: ${provider}, doing nothing.`)
        return
      }

      // If no cookie is found, proceed with fetching and updating the cookie
      switch (provider) {
        case 'Getty Images':
          createGettyImagesWindow()
          break
        // Add more cases here if you have other providers
        default:
          console.log(`No action for provider: ${provider}`)
          break
      }
    } else {
      console.log('No providers found')
    }
  } catch (error) {
    console.error('Error fetching provider:', error)
  }
}

export { fetchAndUpdateCookie }
