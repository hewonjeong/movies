import axios from 'axios'

const https = require('https')

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

export default async (url: string) => {
  const response = await axios.get<string>(url, { httpsAgent })
  return response.data
}
