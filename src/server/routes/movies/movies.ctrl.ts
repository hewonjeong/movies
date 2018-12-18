import { Request, Response } from 'express'
import Movie from '../../../models/Movie'
import { Movie as MovieType } from '../../../types/'

export const getMovie = (req: Request, res: Response) => {}

export const getMovies = async (req: Request, res: Response) => {
  const result: MovieType[] = await Movie.scan({
    minYear: 2018,
  })
  res.send({ data: parse(result) })
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
