import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk';
import { IFamily } from '../interfaces/IFamily';
import { IMember } from '../interfaces/IMember';

interface IExpressionAttributeValues {
  ':hashKeyValue': string;
  ':rangeKeyValue'?: string;
}

interface IParamsObject {
  TableName: string;
  KeyConditionExpression: string;
  ExpressionAttributeValues: IExpressionAttributeValues;
  IndexName?: string;
}

class DynamoUtilities {

  private ParamsObjectFactory(tableName: string, hashName: string, hashValue: string, indexName: string | null = null,
    rangeName: string | null = null, rangeValue: string | null = null): DocumentClient.QueryInput {
    let paramsObject: IParamsObject = {
      TableName: tableName,
      KeyConditionExpression: `${hashName} = :hashKeyValue`,
      ExpressionAttributeValues: {
        ':hashKeyValue': hashValue
      }
    };

    if (rangeName && rangeValue) {
      paramsObject.KeyConditionExpression += ` and ${rangeName} = :rangeKeyValue`;
      paramsObject.ExpressionAttributeValues = {
        ':hashKeyValue': hashValue,
        ':rangeKeyValue': rangeValue
      };
    }

    if (indexName) paramsObject.IndexName = indexName;

    return paramsObject;
  }

  public Query(tableName: string, hashName: string, hashValue: string, indexName: string | null = null,
    rangeName: string | null = null, rangeValue: string | null = null): Promise<DocumentClient.QueryOutput> {
    const queryObj: DocumentClient.QueryInput = this.ParamsObjectFactory(tableName, hashName, hashValue, indexName, rangeName, rangeValue);
    
    const docClient = new DocumentClient();

    return new Promise(function (resolve, reject) {
      docClient
        .query(queryObj)
        .promise()
        .then((res: DocumentClient.QueryOutput) => resolve(res))
        .catch((err: AWSError) => reject('Error querying dynamo: ' + err));
    });
  }

  public PutItem(tableName: string, item: IFamily | IMember): Promise<IFamily | IMember> {
    return new Promise(function (resolve, reject) {

      var params: DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: item
      };

      const docClient = new DocumentClient();

      docClient
        .put(params)
        .promise()
        .then(() => resolve(item))
        .catch((err: AWSError) => reject('Error putting document to dynamo: ' + err));
    });
  }

  public DeleteItem(tableName: string, id: string): Promise<void> {
    return new Promise(function (resolve, reject) {

      var params: DocumentClient.DeleteItemInput = {
        TableName: tableName,
        Key: { Id: id }
      };

      const docClient = new DocumentClient();

      docClient
        .delete(params)
        .promise()
        .then(() => resolve())
        .catch((err: AWSError) => reject('Error deleting document to dynamo: ' + err));
    });
  }

  // TODO: Figure out how to type this function
  // public BatchPutItem(tableName: string, itemList) {
  //   return new Promise(function(resolve, reject) {
  //     let ddb = new DynamoDB();

  //     let putRequests = itemList.map((item) => {
  //       return {
  //         PutRequest: { Item: item }
  //       };
  //     });

  //     let params = {
  //       RequestItems: {
  //         [tableName]: putRequests
  //       }
  //     };

  //     ddb
  //       .batchWriteItem(params)
  //       .promise()
  //       .then(() => {
  //         return resolve(params.RequestItems);
  //       })
  //       .catch((err: AWSError) => {
  //         return reject('Error putting list of documents(batch) to dynamo: ' + err);
  //       });
  //   });
  // }
}

export const DynamoUtils = new DynamoUtilities();
