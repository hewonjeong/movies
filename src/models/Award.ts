import awsSdk from 'aws-sdk'
import { aws } from '../config/constans'
import { Award as AwardType } from '../types/Awards'

export default class Award {
  static client = new awsSdk.DynamoDB.DocumentClient(aws)
  static TABLE = 'awards'

  static async create(award: AwardType) {
    const params = {
      TableName: Award.TABLE,
      Item: award,
    }
    await Award.client.put(params).promise()
    return award
  }

  static async batch(awards: AwardType[]) {
    const params = {
      RequestItems: {
        [Award.TABLE]: awards.map(award => ({
          PutRequest: { Item: award },
        })),
      },
    }
    return await Award.client.batchWrite(params).promise()
  }
}
