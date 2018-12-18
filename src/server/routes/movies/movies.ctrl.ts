import { Request, Response } from 'express'
import Movie, { Scanner } from '../../../models/Movie'
import { Movie as MovieType } from '../../../types/'

export const getMovie = (req: Request, res: Response) => {}

export const getMovies = async (req: Request, res: Response) => {
  const result: MovieType[] = await Movie.scan(getScanner(req.query))
  res.send({
    list: parse(result),
  })
}

const getScanner = (query: any): Scanner => {
  const { minYear, maxYear, genre, tomatoScore, popcornScore, title } = query
  return {
    title,
    minYear: minYear ? parseInt(minYear, 10) : undefined,
    maxYear: maxYear ? parseInt(maxYear, 10) : undefined,
    genre: genre ? genre.split(',') : undefined,
    tomatoScore: tomatoScore ? parseFloat(tomatoScore) : undefined,
    popcornScore: popcornScore ? parseFloat(popcornScore) : undefined,
  }
}

const parse = (movies: MovieType[]) => {
  return movies
    .filter(movie => {
      const {
        audience: { likeRate },
      } = movie
      const tomatoScore = getTomatoScore(movie)
      return tomatoScore >= 0.85 && likeRate >= 0.8
    })
    .sort((a, b) => getTomatoScore(a) - getTomatoScore(b))
}
const getTomatoScore = (movie: MovieType) => {
  const {
    tomatoMeter: { counts, fresh },
  } = movie
  const tomatoScore = fresh / counts
  return tomatoScore
}
