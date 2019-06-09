import fs from 'fs'
import { readFile } from '../utils/file'
import fetchMovie, { ImdbMovie } from '../services/OmdbService'
import getRT from '../services/getRTUrl'
import getDocument from '../getDocument'
import parseMovie from '../parsers/parseMovie'
import readline from 'readline'
import es from 'event-stream'
import OmdbService from '../services/OmdbService'
// const OUTPUT = 'datasets/movies.tsv'

// const outstream = fs.createWriteStream(OUTPUT)
// readFile(FILE, async (id: string) => {
//   const imdb = await fetchMovie(id)
// })

const log = 'datasets/movie.tsv'
const error = 'datasets/error.tsv'

const logStream = fs.createWriteStream(log)
const errorStream = fs.createWriteStream(error)

const TARGET = 'tt0000004'
const endpoint = 'https://www.rottentomatoes.com/'

const FILE = 'datasets/id.tsv'

const s = fs
  .createReadStream(FILE)
  .pipe(es.split())
  .pipe(
    es
      .mapSync(async (id: string) => {
        s.pause()
        await main(id)
        s.resume()
      })
      .on('error', err => {
        console.log('Error while reading file.', err)
      })
      .on('end', () => {
        console.log('END')
      })
  )

const main = async (target: string) => {
  console.log(target)
  try {
    const imdbMovie = await OmdbService.fetchMovie(target)
    if (imdbMovie.runtime < 60) {
      return
      // throw new Error( `${target}\ttoo short: ${imdbMovie.title} (runtime: ${imdbMovie.runtime})` )
    }
    const rtUrl = await getRT(imdbMovie)
    if (rtUrl) {
      const document = await getDocument(`${endpoint}${rtUrl}`)
      const rtMovie = parseMovie(document)
      logStream.write(
        `${target}\t${JSON.stringify(imdbMovie)}\t${JSON.stringify(rtMovie)}}\n`
      )
    } else {
      throw new Error(`No Url: ${imdbMovie.title}`)
    }
  } catch (e) {
    errorStream.write(`${target}\t${e.message}\n`)
  }
}
