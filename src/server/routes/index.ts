import { Router, Response, Request } from 'express'
import movies from './movies'
const routes = Router()

routes.use('/movies', movies)

routes.get('/', (req, res) => {
  res.send('GET')
})

routes.post('/', (req, res) => {
  res.send('POST')
})

export default routes
