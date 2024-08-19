import axios from 'axios'
import cherrio from 'cheerio'
import { USERAGENT } from '../../const/constant'
import { getCookie, insertWallpaper } from '../../storage/db'

const searchImages = async (query: string, type: string) => {
  try {
    const images: string[] = []
    const url = `https://www.gettyimages.com/search/2/image?family=${type}&orientations=horizontal&phrase=${encodeURI(query)}`

    const { data } = await axios.get(url, {
      headers: {
        Cookie: getCookie('Getty Images').cookie,
        'User-Agent': USERAGENT
      }
    })

    const $ = cherrio.load(data)
    $('div[data-testid="galleryMosaicAsset"]').each((_, element) => {
      const href = $(element).find('a').attr('href')
      images.push('https://www.gettyimages.com' + href)
    })

    for (const image of images) {
      // timeout to avoid rate limiting
      getImages(image, query)
    }
    // return $
  } catch (error) {
    console.error('Getty Images search error:', error)
  }
}

const getImages = async (url: string, query: string) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        Cookie: getCookie('Getty Images').cookie,
        'User-Agent': USERAGENT
      }
    })

    const $ = cherrio.load(data)
    // Find <source> tags within <picture> elements that have type="image/jpeg" and no media attribute
    const sources = $('picture source[type="image/jpeg"]').filter((_, el) => {
      const media = $(el).attr('media')
      const srcset = $(el).attr('srcset')

      // Ensure the <source> tag doesn't have a media attribute and contains 2048x2048 image
      return !media && !!srcset && srcset.includes('2048x2048')
    })

    // Get the srcset attribute of the filtered <source> tag
    const srcsets = sources.map((_, el) => $(el).attr('srcset')).get()

    insertWallpaper(srcsets[0], query)
  } catch (error) {
    console.error('Getty Images search error:', error)
  }
}
export { searchImages, getImages }
