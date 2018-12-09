import awsSdk, { DynamoDB } from 'aws-sdk'
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service'
import aws from '../config/aws'
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

export const configure = () => {
  const { region } = aws
  console.log('region', region)
  awsSdk.config.update({
    region,
  } as ServiceConfigurationOptions)
}
