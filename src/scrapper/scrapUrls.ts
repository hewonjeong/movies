import lodash from 'lodash'
import Url from '../models/Url'
import getLinks from '../getLinks'
import getDocument from '../getDocument'

const FROM = 1980
const URL = 'https://www.rottentomatoes.com/top/bestofrt/'
const SELECTOR = 'table.table'

const getSize = (year = new Date().getFullYear()) => year - FROM + 1

const targets = Array.apply(null, Array(getSize())).map(
  (_: object, i: number) => `${URL}?year=${FROM + i}`
)

const getPromise = async (url: string) => await getDocument(url)
const promises = targets.map(getPromise)

export const getUrls = async () => {
  const documents = await Promise.all(promises)
  const urls = lodash.flatten(
    documents.map(doc => getLinks(doc as string, SELECTOR))
  )
  return urls
}

const scrapUrls = async () => {
  const urls = await getUrls()
  await batch(urls)
}
export default scrapUrls

const batch = async (urls: string[]) => {
  const SIZE = 25
  let arr = []
  for (let i = 0; i < urls.length; i = i + 1) {
    arr.push(urls[i])
    if (arr.length === SIZE || i === urls.length - 1) {
      await Url.batch(arr)
      arr = []
    }
  }
}
