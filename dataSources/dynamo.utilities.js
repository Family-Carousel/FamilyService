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
                    return resolve(item);
                })
                .catch((err) => {
                    return reject('Error putting document to dynamo: ' + err);
                })
        });
    },
};