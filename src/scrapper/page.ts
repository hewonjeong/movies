import fs from 'fs'
import stream from './utils/stream'
import getDocument from '../getDocument'
import parseMovie from '../parsers/parseMovie'

const INPUT = 'dists/rt002.tsv'
const OUTPUT = 'dists/movies002.tsv'
const ERROR = 'dists/movies002.error.tsv'
const BATCH_SIZE = 12

async function main() {
  const outStream = fs.createWriteStream(OUTPUT)
  const errStream = fs.createWriteStream(ERROR)

  const job = async (id: string, url: string) => {
    try {
      const document = await getDocument(`https://www.rottentomatoes.com${url}`)
      const movie = parseMovie(document)
      outStream.write(`${id}\t${JSON.stringify(movie)}\n`)
    } catch (e) {
      errStream.write(`${id}\t${url}\t${e}\n`)
    }
  }

  let batch: Promise<void>[] = []
  await stream(INPUT, async line => {
    const [id, url, score, title, year] = line.split('\t')
    if (score !== '0') {
      batch.push(job(id, url))
      if (batch.length === BATCH_SIZE) {
        await Promise.all(batch)
        batch = []
      }
    }
  })
  await Promise.all(batch)
}
main()
