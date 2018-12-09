import awsSdk, { DynamoDB } from 'aws-sdk'
import urls from './tables/urls'
import { log, configure } from './utils'

const dynamodb = new awsSdk.DynamoDB()
const tables = [urls]

const message = {
  success: '👏🏻 Created table. Table description JSON:',
  error: '😈 Unable to create table. Error JSON:',
}

const createTables = (
  dynamodb: DynamoDB,
  tables: DynamoDB.CreateTableInput[]
) => tables.map(table => dynamodb.createTable(table, log(message)))

createTables(dynamodb, tables)
