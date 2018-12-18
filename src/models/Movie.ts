import awsSdk, { ResourceGroupsTaggingAPI } from 'aws-sdk'
import { aws } from '../config/constans'
import { Movie as MovieType } from '../types'
import { ScanInput, AttributeMap, Key } from 'aws-sdk/clients/dynamodb'
import times from 'lodash/times'

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
    let res: MovieType[] = []
    let exclusiveStartKey = undefined
    do {
      const params = getParams(scanner, exclusiveStartKey)
      const { Items = [], LastEvaluatedKey = {} } = await Movie.client
        .scan(params)
        .promise()
      res = res.concat(Items as MovieType[])
      exclusiveStartKey = LastEvaluatedKey.key
    } while (exclusiveStartKey)
    return res
  }
}

const getAttributes = (scanner: Scanner) => {
  const { minYear, maxYear, title, rating, genre, popcornScore } = scanner
  return [
    !!title && 'title',
    !!(minYear || maxYear) && 'year',
    !!rating && 'rating',
    !!genre && 'genre',
    !!popcornScore && 'audience',
    !!popcornScore && 'likeRate',
  ]
    .filter(Boolean)
    .reduce((acc, cur) => {
      return Object.assign({}, acc, cur && { [`#${cur}`]: cur })
    }, {})
}

// [1,3,7] => { :genre0: 1, :genre1: 3, :genre2: 7}
const getGenre = (arr: number[]) => {
  return arr.reduce(
    (acc, cur, i) => Object.assign({}, acc, { [`:genre${i}`]: cur }),
    {}
  )
}

// [1,3,7] => contains (#genre :genre0) or contains (#genre :genre1), contains (#genre :genre2)
const getGenreExpresstion = (length: number) => {
  const expresstion = times(length, i => `contains (#genre, :genre${i})`).join(
    ' and '
  )
  return `(${expresstion})`
}
const getParams = (scanner: Scanner, exclusiveStartKey?: string) => {
  const { minYear, maxYear, title, rating, genre } = scanner
  const { popcornScore } = scanner
  const expression = [
    title && 'contains (#title, :title)',
    minYear && '#year >= :minYear',
    maxYear && '#year <= :maxYear',
    genre && getGenreExpresstion(genre.length),
    popcornScore && '#audience.#likeRate >= :audience',
  ]
    .filter(Boolean)
    .join(' and ')
  const attributes = getAttributes(scanner)

  return {
    TableName: 'movies',
    FilterExpression: expression,
    ExpressionAttributeNames: attributes,
    ExpressionAttributeValues: Object.assign(
      {},
      {
        ':minYear': minYear,
        ':maxYear': maxYear,
        ':title': title,
        ':audience': popcornScore,
        // TODO: add more ExpressionAttributeValues
        // ':tomatoScore': tomatoScore,
        // ':rating': rating,
      },
      genre && getGenre(genre)
    ),
    ExclusiveStartKey: exclusiveStartKey
      ? { key: exclusiveStartKey }
      : undefined,
  }
}
export interface Scanner {
  minYear?: number
  maxYear?: number
  genre?: number[]
  tomatoScore?: number
  popcornScore?: number
  title?: string
  rating?: string
}
