import fs from 'fs'
import { readFile } from '../utils/file'

/* configs */
const FILE = 'datasets/title.ratings.tsv'
const OUTPUT = 'datasets/id.tsv'
const MIN_COUNTS = 100

const outstream = fs.createWriteStream(OUTPUT)
readFile(FILE, (line: string) => {
  const [id, _, rawCounts] = line.split('\t')
  const counts = parseInt(rawCounts, 10)
  if (counts >= MIN_COUNTS) {
    outstream.write(`${id}\n`)
  }
})
