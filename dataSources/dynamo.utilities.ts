import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { AWSError, DynamoDB } from 'aws-sdk';
import { IFamily } from '../interfaces/IFamily';
import { IMember } from '../interfaces/IMember';
import { ICalendar } from '../interfaces/ICalendar';

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
    rangeName: string | null, rangeValue: string | null): Promise<DynamoDB.DocumentClient.QueryOutput>;
  PutItem(tableName: string, item: IFamily | IMember | ICalendar): Promise<IFamily | IMember | ICalendar>;
  DeleteItem(tableName: string, id: string, rangeName: string | null, rangeId: string | null): Promise<void>;
}

@injectable()
export class DynamoUtilities implements IDynamoUtilities {
  protected _dynamoClient: DynamoDB.DocumentClient;

  constructor(@inject(DynamoDB.DocumentClient) dynamoClient: DynamoDB.DocumentClient) {
    this._dynamoClient = dynamoClient;
  }

  private ParamsObjectFactory(tableName: string, hashName: string, hashValue: string, indexName: string | null = null,
    rangeName: string | null = null, rangeValue: string | null = null): DynamoDB.DocumentClient.QueryInput {
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
    rangeName: string | null = null, rangeValue: string | null = null): Promise<DynamoDB.DocumentClient.QueryOutput> {
    const queryObj: DynamoDB.DocumentClient.QueryInput = this.ParamsObjectFactory(tableName, hashName, hashValue, indexName, rangeName, rangeValue);

    return new Promise(function (resolve, reject) {
      this._dynamoClient
        .query(queryObj)
        .promise()
        .then((res: DynamoDB.DocumentClient.QueryOutput) => resolve(res))
        .catch((err: AWSError) => reject('Error querying dynamo: ' + err));
    });
  }

  public PutItem(tableName: string, item: IFamily | IMember | ICalendar): Promise<IFamily | IMember | ICalendar> {
    return new Promise(function (resolve, reject) {

      var params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: item
      };

      this._dynamoClient
        .put(params)
        .promise()
        .then(() => resolve(item))
        .catch((err: AWSError) => reject('Error putting document to dynamo: ' + err));
    });
  }

  public DeleteItem(tableName: string, id: string, rangeName: string | null = null, rangeId: string | null = null): Promise<void> {
    return new Promise(function (resolve, reject) {

      var params: DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: tableName,
        Key: { Id: id }
      };

      if (rangeName && rangeId) {
        // for familys
        if (rangeName === 'FamilyOwner') {
          params.Key = { Id: id, FamilyOwner: rangeId }
        }

        // for members
        if (rangeName === 'FamilyId') {
          params.Key = { Id: id, FamilyId: rangeId }
        }

        // for calendar events
        if (rangeName === 'Id') {
          params.Key = { FamilyId: id, Id: rangeId }
        }
      }

      this._dynamoClient
        .delete(params)
        .promise()
        .then(() => resolve())
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
