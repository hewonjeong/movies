import stream from './utils/stream'
import { processResponse, Response } from '../services/OmdbService'

const INPUT = 'dists/rt.180127.000.tsv'
const OMDB = 'dists/omdb.180127.000.tsv'

async function getOmdbSet() {
  const set = new Set()
  await stream(OMDB, line => {
    const [id, chunk] = line.split('\t')
    try {
      const response: Response = JSON.parse(chunk)
      const movie = processResponse(response)
      if (movie.votes > 300) set.add(id)
    } catch (e) {
      console.log(id, chunk.substring(0, 100))
    }
  })
  return set
}
async function main() {}
main()
