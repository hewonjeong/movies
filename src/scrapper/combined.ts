import fs from 'fs'
import stream from './utils/stream'

interface Line {
  id: string
  type: string
  title: string
  originalTitle: string
  isAdult: string
  year: string
  endYear: string
  runtime: string
  genres: string[]
}
const toTsvLine = (line: Line) => {
  const {
    id,
    type,
    title,
    originalTitle,
    isAdult,
    year,
    endYear,
    runtime,
    genres,
  } = line
  return `${[
    id,
    type,
    title,
    originalTitle,
    isAdult,
    year,
    endYear,
    runtime,
    genres.join(','),
  ].join('\t')}\n`
}
const parseLine = (line: string): Line => {
  const [
    id,
    type,
    title,
    originalTitle,
    isAdult,
    year,
    endYear,
    runtime,
    genresChunk,
  ] = line.split('\t')
  const genres = genresChunk.split(',')

  return {
    id,
    type,
    title,
    originalTitle,
    isAdult,
    year,
    endYear,
    runtime,
    genres,
  }
}

/* 1. 안쓰는 type의 데이터 제거(tvEpisode, tvSpecial, game, videoGame, short) */
const removeByTypeMain = () => {
  const INPUT = 'datasets/title.basics.tsv'
  const OUTPUT = 'dists/title.180127.000.tsv'
  const set = new Set([
    'tvSeries',
    'tvMiniSeries',
    'tvEpisode',
    'tvSpecial',
    'game',
    'videoGame',
    'short',
    'video',
  ])
  const outStream = fs.createWriteStream(OUTPUT)
  const removeByType = (line: string) => {
    const movie = parseLine(line)
    if (!set.has(movie.type)) {
      outStream.write(toTsvLine(movie))
      console.log(movie.id, movie.title, movie.type)
    }
  }
  stream(INPUT, removeByType)
}
// removeByTypeMain()

/* 리뷰수 적은거 필터 */
const removeByVotes = () => {
  const INPUT = 'datasets/id.tsv'
  const DATA = 'dists/title.180127.000.tsv'
  const OUTPUT = 'dists/title.180127.001.tsv'
  const outStream = fs.createWriteStream(OUTPUT)
  const set = new Set()
  const storeId = (id: string) => {
    set.add(id)
  }
  stream(INPUT, storeId)
  const filter = (line: string) => {
    const [id] = line.split('\t')
    if (set.has(id)) {
      console.log(id)
      outStream.write(`${line}\n`)
    }
  }
  stream(DATA, filter)
}
removeByVotes()
