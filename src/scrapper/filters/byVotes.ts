import fs from 'fs'
import stream from '../utils/stream'
import { parseLine } from '../utils/line'

interface IRating {
  id: string
  average: number
  count: number
}

const parseRating = (line: string) => {
  const [id, average, votes] = line.split('\t')
  if (!id || !average || !votes) throw `invalid line: ${line}`

  const rating: IRating = {
    id,
    average: parseFloat(average),
    count: parseInt(votes),
  }

  return rating
}

const getRaings = async () => {
  const INPUT = 'datasets/title.ratings.tsv'
  const ratings = new Map<string, IRating>()
  await stream(INPUT, line => {
    try {
      const rating = parseRating(line)
      ratings.set(rating.id, rating)
    } catch (e) {
      console.error(e)
    }
  })
  return ratings
}

const byRatings = async () => {
  const INPUT = 'dist/title.basics.tsv'
  const OUTPUT = 'dist/title.ratings.tsv'

  const outStream = fs.createWriteStream(OUTPUT)

  const ratings = await getRaings()

  await stream(INPUT, line => {
    try {
      const movie = parseLine(line)
      const rating = ratings.get(movie.id)

      if (rating && rating.count >= 10) outStream.write(line + '\n')
    } catch (e) {
      console.error(e, line)
    }
  })
  console.log('done!')
}

byRatings()
