import env from '../config/env'
env()
import Movie from '../models/Movie'

describe('Movie.scan()', () => {
  it('scan', async () => {
    // const scanner = {
    //   title: 'Star Wars',
    //   minYear: 2010,
    //   maxYear: 2016,
    //   genre: [1],
    //   popcornScore: 0.8,
    // }
    // const scanned = (await Movie.scan(scanner)) || []
    // const received = scanned.map(({ title }) => title)
    // const expected = [
    //   'Star Wars: Episode VII - The Force Awakens',
    //   'Rogue One: A Star Wars Story',
    // ]
    // expect(received).toEqual(expected)
  })
})
