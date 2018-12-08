import cheerio from 'cheerio'

const getLinks = (document: string, selector = 'body') => {
  const $ = cheerio.load(document)
  return $(selector)
    .find('a')
    .map((_, elem) => $(elem).attr('href'))
    .toArray()
    .map(String)
    .filter(url => url.startsWith('/m/') && url.split('/').length === 3)
    .filter((v, i, a) => a.indexOf(v) === i)
}

export default getLinks
