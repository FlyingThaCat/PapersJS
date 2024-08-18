import axios from 'axios'
import cherrio from 'cheerio'

const searchImages = async (query: string, type: string) => {
  try {
    const url = `https://www.gettyimages.com/search/2/image?family=${type}&orientations=horizontal&phrase=${encodeURI(query)}`
    // user agent with axios
    const { data } = await axios.get(url, {
      headers: {
        Cookie:
          'vis=vid=43bd31d2-7587-49b5-a914-e3aa37f0dc00; sp=gsrp=0&es=mostpopular&rps=closed&ei=; _gcl_au=1.1.1545388997.1724005647; _ga=GA1.2.1571811711.1724005647; _gid=GA1.2.691108754.1724005647; gtm_ppn=image_search_results; _gat_UA-85194766-1=1; IR_gbd=gettyimages.com; IR_4202=1724005647132%7C0%7C1724005647132%7C%7C; _ga_DMJJ3WT1SM=GS1.1.1724005646.1.0.1724005647.59.0.0',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15'
      }
    })
    const $ = cherrio.load(data)
    const images = []
    //get data-testid="galleryMosaicAsset"
    $('div[data-testid="galleryMosaicAsset"]').each((_, element) => {
      // get href from a tag
      const href = $(element).find('a').attr('href')
      // push to images array
      images.push('https://www.gettyimages.com' + href)
    })

    for (const image of images) {
      getImages(image)
    }
    // return $
  } catch (error) {
    console.error('Getty Images search error:', error)
  }
}

const getImages = async (url: string) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        Cookie:
          'vis=vid=43bd31d2-7587-49b5-a914-e3aa37f0dc00; sp=gsrp=0&es=mostpopular&rps=closed&ei=; _gcl_au=1.1.1545388997.1724005647; _ga=GA1.2.1571811711.1724005647; _gid=GA1.2.691108754.1724005647; gtm_ppn=image_search_results; _gat_UA-85194766-1=1; IR_gbd=gettyimages.com; IR_4202=1724005647132%7C0%7C1724005647132%7C%7C; _ga_DMJJ3WT1SM=GS1.1.1724005646.1.0.1724005647.59.0.0',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15'
      }
    })

    const $ = cherrio.load(data)
    // Find <source> tags within <picture> elements that have type="image/jpeg" and no media attribute
    const sources = $('picture source[type="image/jpeg"]').filter((i, el) => {
      const media = $(el).attr('media')
      const srcset = $(el).attr('srcset')

      // Ensure the <source> tag doesn't have a media attribute and contains 2048x2048 image
      return !media && srcset && srcset.includes('2048x2048')
    })

    // Get the srcset attribute of the filtered <source> tag
    const srcsets = sources.map((i, el) => $(el).attr('srcset')).get()

    console.log('Filtered srcsets (2048x2048):', srcsets)
  } catch (error) {
    console.error('Getty Images search error:', error)
  }
}
export { searchImages, getImages }
