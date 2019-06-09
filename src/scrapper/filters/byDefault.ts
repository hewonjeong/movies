import fs from 'fs'
import stream from '../utils/stream'
import { TitleType } from './types'
import { parseLine } from '../utils/line'

const excludes = new Set([
  TitleType.GAME,
  TitleType.SHORT,
  TitleType.TV_EPISODE,
  TitleType.TV_SHORT,
  TitleType.VIDEO_GAME,
])

const byDefault = async () => {
  const INPUT = 'datasets/title.basics.tsv'
  const OUTPUT = 'dist/title.basics.tsv'

  const outStream = fs.createWriteStream(OUTPUT)

  await stream(INPUT, line => {
    try {
      const movie = parseLine(line)

      if (
        !excludes.has(movie.type) &&
        movie.year >= 1960 &&
        movie.runtime > 30
      ) {
        outStream.write(line + '\n')
      }
    } catch (e) {
      console.error(e, line)
    }
  })
  console.log('done!')
}

byDefault()
