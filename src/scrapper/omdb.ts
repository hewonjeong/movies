import env from '../config/env'
env()
import Axios from 'axios'
const API = 'http://www.omdbapi.com'
const API_KEY = process.env.OMDB_API_KEY
import fs from 'fs'
import stream from './utils/stream'
import { parseLine } from './utils/line'
import OmdbService from '../services/OmdbService'
import batch from './batch'

const storeOmdb = async () => {
  const INPUT = 'dist/title.ratings.tsv'
  const OUTPUT = 'dist/omdb.chunks'
  const ERROR = 'dist/error.log'

  const outStream = fs.createWriteStream(OUTPUT)
  const errStream = fs.createWriteStream(ERROR)

  const promises: (() => Promise<void>)[] = []

  await stream(INPUT, async line => {
    try {
      const { id } = parseLine(line)

      const job = async () => {
        try {
          const movie = await OmdbService.fetchMovie(id)
          outStream.write(`${id}\t${JSON.stringify(movie)}\n`)
        } catch (e) {
          console.error(id, e.message)
          errStream.write(`${id}\t${e.message}\n`)
        }
      }

      promises.push(job)
    } catch (e) {
      console.error(e)
    }
  })

  await batch(promises)
}
storeOmdb()
