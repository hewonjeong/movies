import { DynamoDB } from 'aws-sdk';

class Table {
  readonly name: string;
  private readonly keySchema: DynamoDB.KeySchemaElement[];
  private readonly attributes: DynamoDB.AttributeDefinitions;
  private readonly throughput: DynamoDB.ProvisionedThroughput;
  private static readonly DEFAULT_THROUGHPUT: DynamoDB.ProvisionedThroughput = {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  };

  constructor(
    name: string,
    keySchema: DynamoDB.KeySchemaElement[],
    attributes: DynamoDB.AttributeDefinitions,
    throughput: DynamoDB.ProvisionedThroughput = Table.DEFAULT_THROUGHPUT
  ) {
    this.name = name;
    this.keySchema = keySchema;
    this.attributes = attributes;
    this.throughput = throughput;
  }

  toParams(): DynamoDB.CreateTableInput {
    return {
      TableName: this.name,
      KeySchema: this.keySchema,
      AttributeDefinitions: this.attributes,
      ProvisionedThroughput: this.throughput,
    };
  }
}
