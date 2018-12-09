import fs from 'fs'
import path from 'path'

export default () => {
  const { NODE_ENV } = process.env
  if (!NODE_ENV) {
    throw new Error(
      'The NODE_ENV environment variable is required but was not specified.'
    )
  }
  const appDirectory = fs.realpathSync(process.cwd())

  const resolveApp = (relativePath: string) =>
    path.resolve(appDirectory, relativePath)

  const paths = {
    dotenv: resolveApp('.env'),
  }

  const dotenvFiles = [
    `${paths.dotenv}.${NODE_ENV}.local`,
    `${paths.dotenv}.${NODE_ENV}`,
    NODE_ENV !== 'test' && `${paths.dotenv}.local`,
    paths.dotenv,
  ].filter(Boolean)

  dotenvFiles.forEach(dotenvFile => {
    if (dotenvFile && fs.existsSync(dotenvFile)) {
      require('dotenv-expand')(
        require('dotenv').config({
          path: dotenvFile,
        })
      )
    }
  })
}
