import Axios from 'axios'
import _ from 'lodash'

const API = 'https://www.rottentomatoes.com/api/private/v2.0/search'
const LIMIT = 10
const getRT = async (movie: Movie) => {
  try {
    const { data: response } = await Axios.get<Response>(API, {
      params: { q: movie.title, limit: LIMIT, type: movie },
    })
    return process(movie, response)
  } catch (e) {
    return null
  }
}
export default getRT

const process = (movie: Movie, { movies }: Response) => {
  const func = getScore(movie)
  if (!movies.length) return ''
  const scored = movies
    .filter(m => m.url !== '/m/null')
    .map(m => ({ ...m, score: func(m) }))

  const top = _.orderBy(scored, 'score', 'desc')
  return top.length ? top[0] : null
}

type Searched = Response['movies'][0]
type Rule = (searched: Searched) => number

const getScore = ({ title, year, casts }: Movie) => (searched: Searched) => {
  const set = new Set(casts)
  const rules: Rule[] = [
    ({ name }) => (name === title ? 100 : 0),
    searched => (searched.year === year ? 100 : 0),
    ({ name }) => {
      const splitted = name.split(' (')
      return splitted.length && splitted[0] === title ? 100 : 0
    },
    searched => (searched.year === year && searched.name === title ? 200 : 0),
    ({ castItems }) =>
      castItems.filter(cast => set.has(cast.name)).length * 100,
  ]
  return rules.reduce((acc, cur) => acc + cur(searched), 0)
}

const main = async () => {
  const result = await getRT({
    title: 'Hawaii',
    year: 1966,
    casts: ['Julie Andrews', 'Max von Sydow', 'Richard Harris', 'Gene Hackman'],
  })
  console.log(result)
}
// main()

type Movie = { title: string; year: number; casts: string[] }
interface Response {
  actors: { name: string; url: string; image: string }[]
  critics: any[]
  franchises: any[]
  movies: {
    name: string
    year: number
    url: string
    image: string
    meterClass: string
    meterScore: number
    castItems: { name: string; url: string }[]
    subline: string
  }[]
  tvSeries: {
    title: string
    startYear: number
    endYear: number
    url: string
    meterClass: string
    image: string
  }[]
}
