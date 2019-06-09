import stream from './utils/stream'
import fs from 'fs'
import _ from 'lodash'
import getRT from '../services/getRTUrl'
import { ImdbMovie, Response, processResponse } from '../services/OmdbService'

const st = require('util').promisify(setTimeout)
const sleep = async (secs: number) => {
  await st(secs * 1000)
}

const getRt = async (
  movie: ImdbMovie,
  title: string,
  originalTitle: string
) => {
  const t1 = await getRT(movie)
  if (t1) return t1

  const t2 = await getRT({ ...movie, title })
  if (t2) return t2

  const t3 = await getRT({ ...movie, title: originalTitle })
  if (t3) return t3

  return null
}

const getMap = async () => {
  const DATASET = 'dists/title.180127.001.tsv'
  const map = new Map()
  const on = async (line: string) => {
    const [id, type, title, originalTitle] = line.split('\t')
    map.set(id, [title, originalTitle])
  }
  stream(DATASET, on)
  await sleep(10)
  return map
}

const storeRTId = async () => {
  const OMDB = 'dists/omdb.180127.000.tsv'
  const OUTPUT = 'dists/rt.180127.000.tsv'
  const ERROR = 'dists/rt.error.000.tsv'
  const map = await getMap()
  const outStream = fs.createWriteStream(OUTPUT)
  const errorStream = fs.createWriteStream(ERROR)

  const BATCH_SIZE = 32
  let batch: Promise<any>[] = []
  let items: any[] = []
  const on = async (line: string) => {
    try {
      const [id, chunk] = line.split('\t')
      const response: Response = JSON.parse(chunk)
      const movie = processResponse(response)

      const [title, originalTitle] = map.get(id)
      items.push({ id, title, originalTitle, omdbTitle: movie.title })
      batch.push(getRt(movie, title, originalTitle))

      if (batch.length === BATCH_SIZE) {
        const rts = await Promise.all(batch)
        rts.forEach((rt, i) => {
          const item = items[i]
          rt
            ? outStream.write(
                `${item.id}\t${rt.url}\t${rt.score}\t${rt.name}\t${rt.year}\n`
              )
            : errorStream.write(
                `${_.uniq([
                  item.id,
                  item.omdbTitle,
                  item.title,
                  item.originalTitle,
                ]).join('\t')}\n`
              )
        })
        batch = []
        items = []
      }
    } catch (e) {
      console.log('error:', line)
      errorStream.write(`${line}\n`)
    }
  }
  console.log('STREAM')
  stream(OMDB, on)
}
storeRTId()
