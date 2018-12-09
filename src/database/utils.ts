import { DynamoDB } from 'aws-sdk'
interface Message {
  success: string
  error: string
}
export const log = (message: Message) => (
  err: AWS.AWSError,
  data: DynamoDB.CreateTableOutput | DynamoDB.DeleteTableOutput
) => {
  const stringify = (obj: object) => JSON.stringify(obj, undefined, 2)
  if (err) console.error(message.error, stringify(err))
  else console.log(message.success, stringify(data))
}
