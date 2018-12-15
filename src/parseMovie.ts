import cheerio from 'cheerio'
import { Movie } from './types'

enum Genre {
  Action,
  Animation,
  ArtAndForeign,
  Classics,
  Comedy,
  Documentary,
  Drama,
  Horror,
  KidsAndFamily,
  Mystery,
  Romance,
  SciFiAndFantasy,
}

// TODO: define Document type and replace string parameter
export default (document: string): Movie => {
  const $ = cheerio.load(document)
  const key = $('meta[property=og\\:url]')
    .attr('content')
    .replace('https://www.rottentomatoes.com/m/', '')
    .replace('/', '')

  const parseTomatoMeter = (dom: Cheerio) => {
    const [average, counts, fresh, rotten] = dom
      .find('div.superPageFontColor')
      .map((_, elem) => {
        $(elem)
          .find('.subtle')
          .remove()
        return $(elem)
          .text()
          .trim()
          .split('/')[0]
      })
      .toArray()
      .map(s => parseFloat(String(s)))
    const score = fresh / counts
    return { score, average, counts, fresh, rotten }
  }
  const poster = $('#poster_link img')
    .attr('data-srcset')
    .split(' ')[0]
  console.log('poster', poster)
  const parseInfo = (dom: Cheerio) => {
    const description = dom
      .find('#movieSynopsis')
      .text()
      .trim()
    const rows = infoDom.find('.meta-row')
    const getRow = (key: string) =>
      rows.find(`.meta-label:contains(${key})`).siblings('.meta-value')

    const genre = getRow('Genre')
      .find('a')
      .map(
        (_, elem) =>
          $(elem)
            .attr('href')
            .split('genres=')[1] || ''
      )
      .toArray()
      .map(e => (typeof e === 'string' ? parseInt(e, 10) : NaN))
    const directors = getRow('Directed By')
      .find('a')
      .map((_, elem) => $(elem).text())
      .toArray()
      .map(String)
    const writtors = getRow('Written By')
      .find('a')
      .map((_, elem) => $(elem).text())
      .toArray()
      .map(String)
    const releasedAt = getRow('In Theaters')
      .find('time')
      .attr('datetime')
    const boxOffice =
      parseInt(
        getRow('Box Office')
          .text()
          .replace(/\$|,/gi, ''),
        10
      ) || undefined
    return {
      description,
      genre,
      boxOffice,
      releasedAt,
      writtors,
      directors,
      rating: getRow('Rating')
        .text()
        .split(' ')[0],
    }
  }

  const title = $('#movie-title')
    .contents()
    .first()
    .text()
    .trim()
  const year = parseInt(
    $('.h3.year')
      .first()
      .text()
      .replace('(', '')
      .replace(')', ''),
    10
  )
  const tomatoMeter = parseTomatoMeter($('#scoreStats'))

  const consensus = $('.critic_consensus')
    .first()
    .text()
    .replace('Critics Consensus:', '')
    .trim()

  const audienceScore = $('.audience-panel')
  const parseAudienceScore = (dom: Cheerio) => {
    const likeRate =
      parseInt(
        dom
          .find('span.superPageFontColor')
          .first()
          .text()
          .replace('%', ''),
        10
      ) / 100
    const children = dom.find('.audience-info').children()
    children.find('.subtle').remove()
    const [average, rating] = children
      .map(
        (_, elem) =>
          $(elem)
            .text()
            .trim()
            .replace(',', '')
            .split('/')[0]
      )
      .toArray()
      .map(s => parseFloat(String(s)))
    return {
      average,
      rating,
      likeRate,
    }
  }
  const audience = parseAudienceScore(audienceScore)
  const infoDom = $('.panel.movie_info.media')
  const infos = parseInfo(infoDom)

  const castsDom = $('.cast-item.media.inlineBlock .articleLink')
  const casts = castsDom
    .slice(0, 8)
    .map((_, elem) =>
      $(elem)
        .text()
        .trim()
    )
    .toArray()
    .map(String)

  return {
    key,
    audience,
    tomatoMeter,
    consensus,
    title,
    year,
    casts,
    poster,
    ...infos,
  }
}
