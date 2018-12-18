import { getMovie, getMovies } from './movies.ctrl'
import { Router } from 'express'

const router = Router()

router.get('/:id', getMovie)
router.get('/', getMovies)

export default router
