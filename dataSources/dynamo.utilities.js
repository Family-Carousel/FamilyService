'use strict';

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

module.exports = {
    putObject: async (tableName, item) => {
        return new Promise(function (resolve, reject) {
            var docClient = init.dynamodb();

            var params = {
                TableName: tableName,
                Item: item
            };

            docClient.put(params).promise()
                .then((res) => {
                    return resolve(res.Item);
                })
                .catch((err) => {
                    return reject('Error putting document to dynamo: ' + err);
                })
        });
    },
    list: async (tableName) => {
        return new Promise(function (resolve, reject) {
            var docClient = init.dynamodb();

            var params = {
                TableName: tableName
            };

            docClient.scan(params).promise()
                .then((res) => {
                    if (!res || !res.Items) {
                        return reject('List did not return expected format: ' + JSON.stringify(res));
                    }
                    return resolve(res.Items);
                })
                .catch((err) => {
                    return reject('Error getting list from dynamo: ' + err);
                })
        });
    },
    paramsObjectFactory: (tableName, indexName, attributeName, key) => {
        return {
            TableName: tableName,
            indexName: indexName,
            KeyConditionExpression: attributeName + ' = :hashKeyValue',
            ExpressionAttributeValues: {
                ':hashKeyValue': key
            }
        };
    },
    query: async (queryObj) => {
        return new Promise(function (resolve, reject) {
            var docClient = init.dynamodb();

            docClient.query(queryObj).promise()
                .then((res) => {
                    if (!res || !res.Items) {
                        return reject('Query did not return expected format: ' + JSON.stringify(res));
                    }
                    return resolve(res.Items);
                })
                .catch((err) => {
                    return reject('Error getting Query from dynamo: ' + err);
                })
        });
    },
    getByHashKey: async (tableName, keyObj) => {
        return new Promise(function (resolve, reject) {
            var docClient = init.dynamodb();

            var params = {
                TableName: tableName,
                key: keyObj
            };

            docClient.get(params).promise()
                .then((res) => {
                    if (!res || !res.Item) {
                        return reject('Key does not exist in table: ' + JSON.stringify(res));
                    }
                    return resolve(res.Item);
                })
                .catch((err) => {
                    return reject('Error getting Document from dynamo: ' + err);
                })
        });
    },
};