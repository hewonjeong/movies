export interface IBasic {
  id: string
  type: TitleType
  title: string
  originalTitle: string
  isAdult: boolean
  year: number
  endYear?: number
  runtime: number
  genres: string[]
}

export enum TitleType {
  SHORT = 'short',
  MOVIE = 'movie',
  TV_EPISODE = 'tvEpisode',
  TV_MOVIE = 'tvMovie',
  VIDEO = 'video',
  TV_SERIES = 'tvSeries',
  TV_MINI_SERIES = 'tvMiniSeries',
  TV_SPECIAL = 'tvSpecial',
  TV_SHORT = 'tvShort',
  GAME = 'game',
  VIDEO_GAME = 'videoGame',
}
