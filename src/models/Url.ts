import awsSdk from 'aws-sdk'
import aws from '../config/aws'

export default class Url {
  static client = new awsSdk.DynamoDB.DocumentClient(aws)

  static TABLE = 'urls'

  static async create(key: string) {
    const params = {
      TableName: Url.TABLE,
      Item: { key },
    }
    await Url.client.put(params).promise()
    return key
  }

  static async batch(keys: string[]) {
    const params = {
      RequestItems: {
        [Url.TABLE]: keys.map(key => ({
          PutRequest: { Item: { key } },
        })),
      },
    }
    return await Url.client.batchWrite(params).promise()
  }
}
