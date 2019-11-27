import axios from 'axios'

const https = require('https')

export default async (url: string) => {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false })
  const response = await axios.get<string>(url, { httpsAgent })

  return response.data
}
