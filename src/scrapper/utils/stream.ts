import fs from 'fs'
import es from 'event-stream'
import { resolve } from 'url'
/**
 * title.ratings.tsv와
 */

const stream = (file: string, on: (line: string) => void) => {
  return new Promise<void>((resolve, reject) => {
    const s = fs
      .createReadStream(file)
      .pipe(es.split())
      .pipe(
        es
          .mapSync(async (line: string) => {
            s.pause()
            await on(line)
            s.resume()
          })
          .on('error', err => {
            reject(err)
          })
          .on('end', () => {
            resolve()
          })
      )
  })
}

export default stream
