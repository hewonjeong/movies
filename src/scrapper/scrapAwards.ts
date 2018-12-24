import env from '../config/env'
env()

import puppeteer from 'puppeteer'
import parseAward from '../parsers/parseAwards'
import Award from '../models/Award'
import { Award as IAward } from '../types/Awards'

// config
const config = {
  eventId: 'ev0000292',
  chromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  minYear: 1980,
  maxYear: new Date().getFullYear(),
}
const TARGET_URL = `https://www.imdb.com/event/${config.eventId}`

const loadDocument = async (url: string) => {
  const browser = await puppeteer.launch({ executablePath: config.chromePath })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' })
  const content = await page.content()
  await page.close()
  await browser.close()
  return content
}

const main = async () => {
  for (let i = config.minYear; i <= config.maxYear; i = i + 1) {
    const document = await loadDocument(`${TARGET_URL}${i}`)
    const awards = parseAward(document)

    for (let j = 0; j < awards.length; j = j + 1) {
      try {
        const award = awards[j]
        await Award.create(award)
      } catch (err) {
        console.error(err)
      }
    }
    console.info('done:', i, Date.now())
  }
}
main()

const batch = async (awards: IAward[]) => {
  const SIZE = 25
  let arr = []
  for (let i = 0; i < awards.length; i = i + 1) {
    arr.push(awards[i])
    if (arr.length === SIZE || i === awards.length - 1) {
      await Award.batch(arr)
      arr = []
    }
  }
}
