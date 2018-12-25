import fs from 'fs'
import readline from 'readline'

export const readFile = (file: string, onLine: (line: string) => void) => {
  const instream = fs.createReadStream(file)

  const rl = readline.createInterface({ input: instream })

  rl.on('line', onLine)
}

const writeFile = (file: string) => {
  const outstream = fs.createWriteStream(file)
}
