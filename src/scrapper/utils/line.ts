import { IBasic, TitleType } from '../filters/types'

export const parseLine = (line: string): IBasic => {
  const [
    id,
    type,
    title,
    originalTitle,
    isAdult,
    startYear,
    endYear,
    runtime,
    genres,
  ] = line.split('\t')
  return {
    id,
    type: getType(type),
    title,
    originalTitle,
    isAdult: isAdult === '1',
    year: parseInt(startYear),
    endYear: parseInt(endYear) || undefined,
    runtime: parseInt(runtime),
    genres: genres.split(','),
  }
}

const TypeMap = new Map<string, TitleType>(
  Object.entries({
    short: TitleType.SHORT,
    movie: TitleType.MOVIE,
    tvEpisode: TitleType.TV_EPISODE,
    tvMovie: TitleType.TV_MOVIE,
    video: TitleType.VIDEO,
    tvSeries: TitleType.TV_SERIES,
    tvMiniSeries: TitleType.TV_MINI_SERIES,
    tvSpecial: TitleType.TV_SPECIAL,
    tvShort: TitleType.TV_SHORT,
    game: TitleType.GAME,
    videoGame: TitleType.VIDEO_GAME,
  })
)

const getType = (key: string) => {
  if (!TypeMap.has(key)) throw 'invalid key: ' + key
  return TypeMap.get(key) as TitleType
}
