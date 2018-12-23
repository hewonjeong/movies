import parseAward from '../scrapper/parseAwards'
import { event } from './samples'

describe('parseMovie()', () => {
  it('basic', () => {
    const received = parseAward(event)
    const expected = {
      length: 120,
      first: {
        id: 'tt1504320',
        title: 'Best Motion Picture of the Year',
        event: 'Oscar',
        year: 2011,
        type: 'winner',
      },
    }
    const [first] = received
    expect(received).toHaveLength(expected.length)
    expect(first).toEqual(expected.first)
  })
})
