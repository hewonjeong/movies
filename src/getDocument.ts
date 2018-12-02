import axios from 'axios'

export default async (url: string) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' // TODO: Remove
  const response = await axios.get<string>(url)
  return response.data
}
