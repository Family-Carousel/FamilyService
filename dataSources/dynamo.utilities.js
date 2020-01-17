const DynamoDB = require('aws-sdk/clients/dynamodb');
const https = require('https');
const AWS = require('aws-sdk');

let awsConfig = {
  region: 'us-east-2',
  httpOptions: { agent: new https.Agent({ keepAlive: true, maxSockets: 50, rejectUnauthorized: true }) }
};

const init = {
  dynamodb: () => {
    return new DynamoDB.DocumentClient(awsConfig);
  }
};

function paramsObjectFactory(tableName, hashName, hashValue, indexName = null, rangeName = null, rangeValue = null) {
  let paramsObject = {
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

module.exports = {
  putObject: async (tableName, item) => {
    return new Promise(function(resolve, reject) {
      var docClient = init.dynamodb();

      var params = {
        TableName: tableName,
        Item: item
      };

      docClient
        .put(params)
        .promise()
        .then(() => {
          return resolve(item);
        })
        .catch((err) => {
          return reject('Error putting document to dynamo. ' + err.message);
        });
    });
  },

  batchPutObjects: async (tableName, itemList) => {
    return new Promise(function(resolve, reject) {
      let ddb = new DynamoDB(awsConfig);
      let putRequests = itemList.map((item) => {
        return {
          PutRequest: { Item: item }
        };
      });

      let params = {
        RequestItems: {
          [tableName]: putRequests
        }
      };

      ddb
        .batchWriteItem(params)
        .promise()
        .then(() => {
          return resolve();
        })
        .catch((err) => {
          return reject('Error putting list of documents(batch) to dynamo. ' + err.message);
        });
    });
  },

  list: async (tableName) => {
    return new Promise(function(resolve, reject) {
      var docClient = init.dynamodb();

      var params = {
        TableName: tableName
      };

      docClient
        .scan(params)
        .promise()
        .then((res) => {
          if (!res || !res.Items) {
            return reject('List did not return in expected format: ' + JSON.stringify(res));
          }
          return resolve(res.Items);
        })
        .catch((err) => {
          console.log(err.message);
          return reject('Error getting document from dynamo. ' + err.message);
        });
    });
  },

  query: async (tableName, hashName, hashValue, indexName = null, rangeName = null, rangeValue = null) => {
    const queryObj = paramsObjectFactory(tableName, hashName, hashValue, indexName, rangeName, rangeValue);
    console.log('tableName', tableName);
    return new Promise(function(resolve, reject) {
      var docClient = init.dynamodb();

      docClient
        .query(queryObj)
        .promise()
        .then((res) => {
          return resolve(res.Items);
        })
        .catch((err) => {
          return reject('Error querying dynamo. ' + err.message);
        });
    });
  }
};