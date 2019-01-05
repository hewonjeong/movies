import env from '../config/env'
env()
import Axios from 'axios'
const API = 'http://www.omdbapi.com'
const API_KEY = process.env.OMDB_API_KEY
import fs from 'fs'
import stream from './utils/stream'

const fetch = async (id: string) => {
  try {
    const { data } = await Axios.get<any>(API, {
      params: { apikey: API_KEY, i: id, plot: 'full' },
      timeout: 10000,
    })
    return `${id}\t${JSON.stringify(data)}\n`
  } catch (error) {
    console.log(id, error.message)
  }
}
const st = require('util').promisify(setTimeout)
const sleep = async (secs: number) => {
  await st(secs * 1000)
}

const storeOmdb = async () => {
  const INPUT = 'dists/title.180127.008.tsv'
  const OUTPUT = 'dists/omdb.180127.007.tsv'
  const outStream = fs.createWriteStream(OUTPUT)
  const ids: string[] = []
  const on = async (line: string) => {
    const [id] = line.split('\t')
    ids.push(id)
  }
  stream(INPUT, on)
  await sleep(10)
  console.log(ids.length)

  const BATCH_SIZE = 32

  let batch: Promise<any>[] = []
  for (let i = 0; i < ids.length; i = i + 1) {
    batch.push(fetch(ids[i]))
    if (batch.length === BATCH_SIZE || i === ids.length - 1) {
      const responses = await Promise.all(batch)
      responses.forEach(res => {
        res && outStream.write(res)
      })
      batch = []
    }
  }
}
storeOmdb()
