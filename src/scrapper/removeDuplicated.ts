import fs from 'fs'
import stream from './utils/stream'

const removeDuplicated = async () => {
  const INPUT = 'dist/omdb copy.chunks'
  const OUTPUT = 'dist/omdb.chunks.temp'

  const set = new Set()
  const outStream = fs.createWriteStream(OUTPUT)

  await stream(INPUT, line => {
    const [id] = line.split('\t')
    if (!set.has(id)) {
      outStream.write(`${line}\n`)
    }
    set.add(id)
  })
}

removeDuplicated()
