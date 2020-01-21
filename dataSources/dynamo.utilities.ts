import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk';
import { IFamily } from '../interfaces/IFamily';

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
    
    let docClient = new DocumentClient();

    return new Promise(function (resolve, reject) {
      docClient
        .query(queryObj)
        .promise()
        .then((res: DocumentClient.QueryOutput) => resolve(res))
        .catch((err: AWSError) => reject('Error querying dynamo: ' + err));
    });
  }

  public PutItem(tableName: string, item: IFamily) {
    return new Promise(function (resolve, reject) {

      var params: DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: item
      };
      
      let docClient = new DocumentClient();

      docClient
        .put(params)
        .promise()
        .then(() => resolve(item))
        .catch((err: AWSError) => reject('Error putting document to dynamo: ' + err));
    });
  }
}

export const DynamoUtils = new DynamoUtilities();



// const init = {
//   dynamodb: () => {
//     return new DynamoDB.DocumentClient(awsConfig);
//   }
// };

// function paramsObjectFactory(tableName, hashName, hashValue, indexName = null, rangeName = null, rangeValue = null) {
//   let paramsObject = {
//     TableName: tableName,
//     KeyConditionExpression: `${hashName} = :hashKeyValue`,
//     ExpressionAttributeValues: {
//       ':hashKeyValue': hashValue
//     }
//   };

//   if (rangeName && rangeValue) {
//     paramsObject.KeyConditionExpression += ` and ${rangeName} = :rangeKeyValue`;
//     paramsObject.ExpressionAttributeValues = {
//       ':hashKeyValue': hashValue,
//       ':rangeKeyValue': rangeValue
//     };
//   }

//   if (indexName) paramsObject.IndexName = indexName;

//   return paramsObject;
// }

// module.exports = {
//   putObject: async (tableName, item) => {
    // return new Promise(function(resolve, reject) {
    //   var docClient = init.dynamodb();

    //   var params = {
    //     TableName: tableName,
    //     Item: item
    //   };

    //   docClient
    //     .put(params)
    //     .promise()
    //     .then(() => {
    //       return resolve(item);
    //     })
    //     .catch((err) => {
    //       return reject('Error putting document to dynamo. ', err);
    //     });
    // });
//   },

//   batchPutObjects: async (tableName, itemList) => {
//     return new Promise(function(resolve, reject) {
//       let ddb = new DynamoDB(awsConfig);
//       let putRequests = itemList.map((item) => {
//         return {
//           PutRequest: { Item: item }
//         };
//       });

//       let params = {
//         RequestItems: {
//           [tableName]: putRequests
//         }
//       };

//       ddb
//         .batchWriteItem(params)
//         .promise()
//         .then(() => {
//           return resolve();
//         })
//         .catch((err) => {
//           return reject('Error putting list of documents(batch) to dynamo. ', err);
//         });
//     });
//   },

//   query: async (tableName, hashName, hashValue, indexName = null, rangeName = null, rangeValue = null) => {
//     const queryObj = paramsObjectFactory(tableName, hashName, hashValue, indexName, rangeName, rangeValue);
//     console.log('tableName', tableName);
    // return new Promise(function(resolve, reject) {
    //   var docClient = init.dynamodb();

    //   docClient
    //     .query(queryObj)
    //     .promise()
    //     .then((res) => {
    //       return resolve(res.Items);
    //     })
    //     .catch((err) => {
    //       return reject('Error querying dynamo. ' + err.message);
    //     });
    // });
//   }
// };