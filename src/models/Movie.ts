import awsSdk from 'aws-sdk'
import { aws } from '../config/constans'
import { Movie as MovieType } from '../types'

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
}
