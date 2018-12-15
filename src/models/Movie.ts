import awsSdk, { ResourceGroupsTaggingAPI } from 'aws-sdk'
import { aws } from '../config/constans'
import { Movie as MovieType } from '../types'
import { ScanInput, AttributeMap, Key } from 'aws-sdk/clients/dynamodb'

export default class Movie {
  static client = new awsSdk.DynamoDB.DocumentClient(aws)
  static TABLE = 'movies'

  static async create(movie: MovieType) {
    const params = {
      TableName: Movie.TABLE,
      Item: movie,
    }
    await Movie.client.put(params).promise()
    return movie
  }

  static async batch(movies: MovieType[]) {
    const params = {
      RequestItems: {
        [Movie.TABLE]: movies.map(movie => ({
          PutRequest: { Item: movie },
        })),
      },
    }
    return await Movie.client.batchWrite(params).promise()
  }

  static async scan(scanner: Scanner) {
    let res: AttributeMap[] = []
    let exclusiveStartKey = undefined
    do {
      const params = getParams(scanner, exclusiveStartKey)
      const { Items = [], LastEvaluatedKey = {} } = await Movie.client
        .scan(params)
        .promise()
      res = res.concat(Items)
      exclusiveStartKey = LastEvaluatedKey.key
    } while (exclusiveStartKey)

    return res
  }
}

const getAttributes = (scanner: Scanner) => {
  const { minYear, maxYear, title, rating, genre } = scanner
  return [
    !!title && 'title',
    !!(minYear || maxYear) && 'year',
    !!rating && 'rating',
    !!genre && 'genre',
  ]
    .filter(Boolean)
    .reduce((acc, cur) => {
      return Object.assign({}, acc, cur && { [`#${cur}`]: cur })
    }, {})
}
const getParams = (scanner: Scanner, exclusiveStartKey?: string) => {
  const { minYear, maxYear, title, rating, genre } = scanner
  const { tomatoScore, popcornScore } = scanner

  const expression = [
    title && 'contains (#title, :title)',
    minYear && '#year >= :minYear',
    maxYear && '#year <= :maxYear',
  ]
    .filter(Boolean)
    .join(' and ')

  const attributes = getAttributes(scanner)

  return {
    TableName: 'movies',
    FilterExpression: expression,
    ExpressionAttributeNames: attributes,
    ExpressionAttributeValues: {
      ':minYear': minYear,
      ':maxYear': maxYear,
      ':title': title,
      // TODO: add more ExpressionAttributeValues
      // ':tomatoScore': tomatoScore,
      // ':popcornScore': popcornScore,
      // ':rating': rating,
      // ...genreValues,
    },
    ExclusiveStartKey: exclusiveStartKey
      ? { key: exclusiveStartKey }
      : undefined,
  }
}
interface Scanner {
  minYear?: number
  maxYear?: number
  title?: string
  tomatoScore?: number
  popcornScore?: number
  rating?: string
  genre?: number[]
}
