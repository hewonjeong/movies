import parseMovie from '../parseMovie'
import { document } from './samples'

describe('parseMovie()', () => {
  it('basic', () => {
    const expected = {
      key: 'black_panther_2018',
      audience: { average: 4.1, rating: 83957, likeRate: 0.79 },
      tomatoMeter: {
        average: 8.2,
        counts: 438,
        fresh: 424,
        rotten: 14,
      },
      consensus:
        "Black Panther elevates superhero cinema to thrilling new heights while telling one of the MCU's most absorbing stories -- and introducing some of its most fully realized characters.",
      title: 'Black Panther',
      year: 2018,
      poster:
        'https://resizing.flixster.com/1UnADcPnlxUtw9k6agsuRVium08=/fit-in/200x296.2962962962963/v1.bTsxMjU1NzcyNTtqOzE3OTIwOzEyMDA7MTY4ODsyNTAw',
      casts: [
        'Chadwick Boseman',
        'Michael B. Jordan',
        "Lupita Nyong'o",
        'Danai Gurira',
        'Martin Freeman',
        'Daniel Kaluuya',
        'Letitia Wright',
        'Winston Duke',
      ],
      description:
        '"Black Panther" follows T\'Challa who, after the events of "Captain America: Civil War," returns home to the isolated, technologically advanced African nation of Wakanda to take his place as King. However, when an old enemy reappears on the radar, T\'Challa\'s mettle as King and Black Panther is tested when he is drawn into a conflict that puts the entire fate of Wakanda and the world at risk.',
      genre: [1, 9, 14],
      boxOffice: 501105037,
      releasedAt: '2018-02-15T16:00:00-08:00',
      writtors: ['Joe Robert Cole', 'Ryan Coogler'],
      directors: ['Ryan Coogler'],
      rating: 'PG-13',
    }
    const received = parseMovie(document)
    expect(received).toEqual(expected)
  })
})
