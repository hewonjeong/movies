import express, { Express } from 'express'
import compression from 'compression' // compresses requests
import bodyParser from 'body-parser'
import expressFlash from 'express-flash'
import path from 'path'
import errorhandler from 'errorhandler'
import lusca from 'lusca'
import routes from './routes'
import passport from 'passport'
import expressValidator from 'express-validator'

export default class Server {
  private app: Express
  private static readonly DEFAULT_PORT = 3300

  constructor() {
    this.app = express()
    this.middleware()
  }

  private middleware() {
    const { NODE_ENV } = process.env

    // express configuration
    this.app.set('views', path.join(__dirname, '../views'))
    this.app.set('view engine', 'pug')
    this.app.use(compression())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(expressValidator())

    this.app.use(expressFlash())
    this.app.use(lusca.xframe('SAMEORIGIN'))
    this.app.use(lusca.xssProtection(true))
    this.app.use(
      express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
    )

    // primary app router
    this.app.use('/', routes)

    // error handler
    NODE_ENV === 'development' && this.app.use(errorhandler())
  }

  listen(port = Server.DEFAULT_PORT) {
    const env = this.app.get('env')
    this.app.set('port', port)
    this.app.listen(port)
    console.log(`🌏⠀App is running at http://localhost:${port} in ${env} mode`)
  }
}
