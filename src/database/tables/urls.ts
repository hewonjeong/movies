export default {
  TableName: 'urls',
  KeySchema: [
    { AttributeName: 'key', KeyType: 'HASH' }, // Partition key
  ],
  AttributeDefinitions: [{ AttributeName: 'key', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
}
