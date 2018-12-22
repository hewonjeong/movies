import fs from 'fs'
import path from 'path'

export const document = fs.readFileSync(
  path.resolve(__dirname, './document.html'),
  'utf8'
)

export const event = fs.readFileSync(
  path.resolve(__dirname, './event.html'),
  'utf8'
)
