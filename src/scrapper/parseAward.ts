import { Award, Event, AwardType } from './Awards'
import cheerio from 'cheerio'

export default (document: string): Award[] => {
  const $ = cheerio.load(document)
  const event = getEvent($('#content-2-wide .event-header h1').text())
  const year = parseInt(
    $('.event-year-header')
      .text()
      .trim()
      .split(' ')[0],
    10
  )
  const tables = $('.event-widgets__award')
    .first()
    .find('.event-widgets__award-category')

  const awards: Award[] = []
  tables.map((_, table) => {
    const title = $(table)
      .find('.event-widgets__award-category-name')
      .text()
    const nominations = $(table).find('.event-widgets__award-nomination')
    nominations.map((_, elem) => {
      const nomi = $(elem)
      const type = parseType(nomi)
      const { name, id } = parseNomination(nomi)
      awards.push({ id, title, event, year, type, name })
    })
  })
  return awards
}

const parseType = (nomi: Cheerio): AwardType => {
  const isWinner = nomi.find('.event-widgets__winner-badge').length
  return isWinner ? 'winner' : 'nominee'
}
const parseNomination = (nomi: Cheerio): { name?: string; id: string } => {
  const main = nomi.find('.event-widgets__primary-nominees a')
  const sub = nomi.find('.event-widgets__secondary-nominees a')
  const name = main.attr('href').startsWith('/name') ? main.text() : undefined
  return {
    name,
    id: (name ? sub : main).attr('href').split('/')[2],
  }
}
const getEvent = (title: string): Event => {
  let event: Event
  if (title.includes('Academy') || title.includes('Oscar')) {
    event = 'Oscar'
  } else if (title.includes('Golden Globes')) {
    event = 'Golden Globe'
  } else {
    throw new Error(`invalid title: ${title}`)
  }
  return event
}
