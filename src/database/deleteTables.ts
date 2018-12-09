import AWS, { DynamoDB } from 'aws-sdk'
import users from './tables/urls'
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service'
import { log, configure } from './utils'

configure()
const dynamodb = new AWS.DynamoDB()
const tables = [users]

const message = {
  success: '👏🏻 Deleted table. Table description JSON:',
  error: '😈 Unable to delete table. Error JSON:',
}

const deleteTables = (
  dynamodb: DynamoDB,
  tables: DynamoDB.CreateTableInput[]
) => tables.map(table => dynamodb.deleteTable(table, log(message)))
dynamodb.listGlobalTables()
deleteTables(dynamodb, tables)
