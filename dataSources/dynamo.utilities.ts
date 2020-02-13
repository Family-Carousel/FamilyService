import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk';
import { IFamily } from '../interfaces/IFamily';
import { IMember } from '../interfaces/IMember';
import { injectable } from 'inversify';

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

interface IDynamoUtilities {
  Query(tableName: string, hashName: string, hashValue: string, indexName: string | null,
    rangeName: string | null, rangeValue: string | null): Promise<DocumentClient.QueryOutput>;
  PutItem(tableName: string, item: IFamily | IMember): Promise<IFamily | IMember>;
  DeleteItem(tableName: string, id: string, rangeName: string | null, rangeId: string | null): Promise<void>;
}

@injectable()
export class DynamoUtilities implements IDynamoUtilities {

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

  public DeleteItem(tableName: string, id: string, rangeName: string | null = null, rangeId: string | null = null): Promise<void> {
    return new Promise(function (resolve, reject) {

      var params: DocumentClient.DeleteItemInput = {
        TableName: tableName,
        Key: { Id: id }
      };

      if (rangeName && rangeId) {
        if (rangeName === 'FamilyOwner') {
          params.Key = { Id: id, FamilyOwner: rangeId }
        }

        if (rangeName === 'FamilyId') {
          params.Key = { Id: id, FamilyId: rangeId }
        }
      }

      console.log('params', params);

      const docClient = new DocumentClient();

      docClient
        .delete(params)
        .promise()
        .then((res) => resolve(console.log(res)))
        .catch((err: AWSError) => reject('Error deleting document from dynamo: ' + err));
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
