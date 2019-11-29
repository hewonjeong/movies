import fs from 'fs'
import stream from './utils/stream'
import getRTUrl from '../services/getRTUrl'
import batch from './batch'

const INPUT = 'dist/omdb.chunks'
const OUTPUT = 'dist/rt'
const ERROR = 'dist/rt.error.log'

async function main() {
  const outStream = fs.createWriteStream(OUTPUT)
  const errStream = fs.createWriteStream(ERROR)

  const promises: (() => Promise<void>)[] = []

  await stream(INPUT, async line => {
    try {
      const [id, chunk] = line.split('\t')
      const movie = JSON.parse(chunk)

      const job = async () => {
        try {
          const rt = await getRTUrl(movie)
          outStream.write(`${id}\t${JSON.stringify(rt)}\n`)
        } catch (e) {
          // console.error(id, e.message)
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
main()
