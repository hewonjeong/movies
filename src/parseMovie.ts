import cheerio from 'cheerio'

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
export default (document: string) => {
  const $ = cheerio.load(document)

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

    return { average, counts, fresh, rotten }
  }

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
    const writtors = getRow('Written By')
      .find('a')
      .map((_, elem) => $(elem).text())
      .toArray()
    const releasedAt = getRow('In Theaters')
      .find('time')
      .attr('datetime')
    const boxOffice = parseInt(
      getRow('Box Office')
        .text()
        .replace(/\$|,/gi, ''),
      10
    )
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

  const title = $('h1.title.hidden-xs')
    .text()
    .trim()

  const year = parseInt(
    $('.h3.year')
      .first()
      .text(),
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

  const casts = $('#movie-cast .castSection .media-body a')
    .slice(0, 8)
    .map((_, elem) =>
      $(elem)
        .text()
        .trim()
    )
    .toArray()

  return {
    audience,
    tomatoMeter,
    consensus,
    title,
    year,
    casts,
    ...infos,
  }
}
