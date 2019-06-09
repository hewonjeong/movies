import env from '../config/env'
env()

import aixos from 'axios'
import { num } from '../utils/numbers'

const API = 'http://www.omdbapi.com'
const API_KEY = process.env.OMDB_API_KEY

const fetchMovie = async (id: string) => {
  const { data } = await aixos.get<Response>(API, {
    params: { apikey: API_KEY, i: id },
  })
  return processResponse(data)
}

export const processResponse = (response: Response): ImdbMovie => {
  const {
    imdbID: id,
    Title: title,
    Plot: plot,
    Language: language,
    Country: country,
    Production: production,
    Website: website,
    Type: type,
    Actors,
  } = response
  const { Year, Runtime, Ratings, imdbVotes, BoxOffice } = response
  const year = num(Year)
  const runtime = num(Runtime.split(' ')[0])
  const ratings = parseRatings(Ratings)
  const votes = num(imdbVotes)
  const boxOffice = num(BoxOffice.split('$')[1])
  const casts = Actors.split(', ').filter(v => v !== 'N/A')

  const formalize = (res: object) => {
    const form = (value: string | number) =>
      value && value !== 'N/A' ? value : undefined
    const reducer = (acc: any, [k, v]: any[]) => ({ ...acc, [k]: form(v) })
    return Object.entries(res).reduce(reducer, {})
  }
  return formalize({
    id,
    title,
    year,
    plot,
    country,
    type,
    runtime,
    ratings,
    boxOffice,
    votes,
    language,
    production,
    website,
    casts,
  })
}

const parseRatings = (ratings: Response['Ratings']) => {
  const parse: {
    [key: string]: (
      item: { Source: string; Value: string }
    ) => { source: string; value: number }
  } = {
    'Internet Movie Database': ({ Source: source, Value }) => ({
      source: 'IMDB',
      value: num(Value.split('/')[0]),
    }),
    'Rotten Tomatoes': ({ Source: source, Value }) => ({
      source,
      value: num(Value.split('%')[0]) * 0.01,
    }),
    Metacritic: ({ Source: source, Value = '' }) => ({
      source,
      value: num(Value.split('/')[0]),
    }),
  }
  return ratings.map(rating => parse[rating.Source](rating))
}
export interface ImdbMovie {
  id: string
  title: string
  year: number
  type: string
  runtime: number
  ratings: { source: string; value: number }[]
  votes: number
  language?: string
  production?: string
  website?: string
  plot?: string
  country?: string
  boxOffice?: number
  casts: string[]
}
export interface Response {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: { Source: string; Value: string }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

const main = async () => {
  const res = await fetchMovie('tt7282468')
  console.log(res)
}

export default {
  fetchMovie,
}
