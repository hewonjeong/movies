import env from './config/env'
import lodash from 'lodash'
env()

import getDocument from './getDocument'
import parseMovie from './parsers/parseMovie'
import cheerio from 'cheerio'
import getLinks from './getLinks'
import Url from './models/Url'
import Movie from './models/Movie'
import { getUrls } from './scrapper/scrapUrls'
import Server from './server'

// const url = 'https://www.rottentomatoes.com/m/black_panther_2018'
const read = async (url: string) => {
  const document = await getDocument(`https://www.rottentomatoes.com${url}`)
  return document
}
// /m/black_panther_2018
const testCasts = async () => {
  const url = '/m/iron_man'
  const document = await read(url)
  const movie = parseMovie(document)
  //console.log(movie)
}
Array(10)
  .fill(null)
  .forEach(testCasts)

const main = async () => {
  const urls = await getUrls()
  for (let i = 0; i < urls.length; i = i + 1) {
    if (i % 100 === 0) console.log(i)
    try {
      const document = await read(urls[i])
      const movie = parseMovie(document)
      Movie.create(movie)
    } catch (err) {
      console.log(err)
      console.log(urls[i])
    }
  }
  console.log('done')
}
//main()

const testEnv = () => {
  env()
  console.log('TEST', process.env.TEST)
}
// testEnv()

const run = () => {
  new Server().listen()
}
//run()
