describe('dynamo.utilities.js', () => {
    let DocumentClient, Dynamo, dynamoSut, params, tableName, hashName, hashValue, indexName, attributeName, key, mockedDynamoDBBatchWriteItem, testItemList;
  
    process.env.TEMPLATE_TABLE = 'MOCKTEMPLATETABLE';
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      aws = require('aws-sdk');
      jest.mock('aws-sdk');
  
      fs = require('fs');
      jest.mock('fs', () => {
        return {
          readFileSync: function() {
            return true;
          }
        };
      });
  
      hashName = 'name';
      hashValue = 'value';
      params = {
        TableName: process.env.TEMPLATE_TABLE,
        KeyConditionExpression: `${hashName} = :hashKeyValue`,
        ExpressionAttributeValues: {
          ':hashKeyValue': hashValue
        }
      };
  
      tableName = process.env.TEMPLATE_TABLE;
      indexName = 'ApplicationId_IDX';
      attributeName = 'ApplicationId';
      key = '1';
  
      DocumentClient = require('aws-sdk/clients/dynamodb').DocumentClient;
      jest.mock('aws-sdk/clients/dynamodb');
  
      dynamoSut = require('./dynamo.utilities');
    });
  
    test('When querying, then we should get items back', async () => {
      expect.hasAssertions();
  
      const mockery = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: [1, 2, 3] })
      });
  
      DocumentClient.mockImplementation(() => {
        return {
          query: mockery
        };
      });
  
      await expect(dynamoSut.query(process.env.TEMPLATE_TABLE, hashName, hashValue)).resolves.toStrictEqual([1, 2, 3]);
  
      expect(mockery).toBeCalledTimes(1);
      expect(mockery).toBeCalledWith(params);
    });
  
    test('When querying with a range key, then we should get an item back', async () => {
      expect.hasAssertions();
  
      const mockery = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: [{ 'my object': 'is of one' }] })
      });
  
      DocumentClient.mockImplementation(() => {
        return {
          query: mockery
        };
      });
  
      await expect(dynamoSut.query(process.env.TEMPLATE_TABLE, hashName, hashValue, null, 'rangeFieldId', '12345')).resolves.toStrictEqual([{ 'my object': 'is of one' }]);
  
      expect(mockery).toBeCalledTimes(1);
    });
  
    test('When querying with a gsi, then we should get items back', async () => {
      expect.hasAssertions();
  
      const mockery = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: [1, 2, 3] })
      });
  
      DocumentClient.mockImplementation(() => {
        return {
          query: mockery
        };
      });
  
      await expect(dynamoSut.query(process.env.TEMPLATE_TABLE, hashName, hashValue, 'rangeFieldId_IDX', 'rangeFieldId', '12345')).resolves.toStrictEqual([1, 2, 3]);
  
      expect(mockery).toBeCalledTimes(1);
    });
  
    test('When querying and there is a server problem, then it should reject', async () => {
      expect.hasAssertions();
  
      const mockery = jest.fn().mockReturnValue({
        promise: jest.fn().mockRejectedValue({ message: 'query error' })
      });
  
      DocumentClient.mockImplementation(() => {
        return {
          query: mockery
        };
      });
  
      await expect(dynamoSut.query(process.env.TEMPLATE_TABLE, hashName, hashValue)).rejects.toBe('Error querying dynamo. query error');
  
      expect(mockery).toBeCalledTimes(1);
      expect(mockery).toBeCalledWith(params);
    });
  
    test('When getting an object by hash, then the object should be returned', async () => {
      expect.hasAssertions();
  
      const mockery = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: { app: 1 } })
      });
  
      DocumentClient.mockImplementation(() => {
        return {
          query: mockery
        };
      });
  
      await expect(dynamoSut.query(process.env.TEMPLATE_TABLE, hashName, hashValue)).resolves.toStrictEqual({ app: 1 });
  
      expect(mockery).toBeCalledTimes(1);
      expect(mockery).toBeCalledWith({
        TableName: process.env.TEMPLATE_TABLE,
        KeyConditionExpression: `${hashName} = :hashKeyValue`,
        ExpressionAttributeValues: {
          ':hashKeyValue': hashValue
        }
      });
    });
  
    test('When putting an object, then a promise should be returned', async () => {
      expect.hasAssertions();
  
      process.env.SELF_SIGNED_CAFILE = 'path/to/config.crt';
  
      const mockery = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue('item')
      });
  
      DocumentClient.mockImplementation(() => {
        return {
          put: mockery
        };
      });
  
      await expect(dynamoSut.putObject('tablename', 'item')).resolves.toBe('item');
  
      expect(mockery).toBeCalledTimes(1);
      process.env.SELF_SIGNED_CAFILE = '';
    });
  
    test('When putting an bad object, then the promise should be rejected', async () => {
      expect.hasAssertions();
  
      const mockery = jest.fn().mockReturnValue({
        promise: jest.fn().mockRejectedValue({ message: 'put error' })
      });
  
      DocumentClient.mockImplementation(() => {
        return {
          put: mockery
        };
      });
  
      await expect(dynamoSut.putObject('tablename', null)).rejects.toBe('Error putting document to dynamo. put error');
  
      expect(mockery).toBeCalledTimes(1);
    });
  
    test('When listing a table, then items should be returned', async () => {
      expect.hasAssertions();
  
      const mockery = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: [1, 2, 3] })
      });
  
      DocumentClient.mockImplementation(() => {
        return {
          scan: mockery
        };
      });
  
      await expect(dynamoSut.list('tablename')).resolves.toStrictEqual([1, 2, 3]);
  
      expect(mockery).toBeCalledTimes(1);
      expect(mockery).toBeCalledWith({
        TableName: 'tablename'
      });
    });
  
    test("When listing a table that doesn't exist, then reject", async () => {
      expect.hasAssertions();
  
      let res = { Items: null };
      const mockery = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue(res)
      });
  
      DocumentClient.mockImplementation(() => {
        return {
          scan: mockery
        };
      });
  
      await expect(dynamoSut.list('tablename')).rejects.toBe('List did not return in expected format: ' + JSON.stringify(res));
  
      expect(mockery).toBeCalledTimes(1);
    });
  
    test('When listing a table and there is a server problem, then reject', async () => {
      expect.hasAssertions();
  
      const mockery = jest.fn().mockReturnValue({
        promise: jest.fn().mockRejectedValue({ message: 'list error' })
      });
  
      DocumentClient.mockImplementation(() => {
        return {
          scan: mockery
        };
      });
  
      await expect(dynamoSut.list('tablename')).rejects.toBe('Error getting document from dynamo. list error');
  
      expect(mockery).toBeCalledTimes(1);
    });
  
    describe('When Saving Multiple Objects', () => {
      beforeEach(() => {
        jest.clearAllMocks();
  
        testItemList = [
          {
            ObjectId: { S: '1' },
            ObjectProp1: { N: '1' },
            ObjectProp2: { S: 'abc' },
            ObjectProp3: { S: '2018-11-06T00:00:11.000Z' }
          },
          {
            ObjectId: { S: '2' },
            ObjectProp1: { N: '1' },
            ObjectProp2: { S: 'def' },
            ObjectProp3: { S: '2018-11-06T00:00:33.000Z' }
          },
          {
            ObjectId: { S: '3' },
            ObjectProp1: { N: '1' },
            ObjectProp2: { S: 'ghi' },
            ObjectProp3: { S: '2018-11-06T00:00:55.000Z' }
          }
        ];
  
        testPutRequestItems = [
          {
            PutRequest: {
              Item: {
                ObjectId: { S: '1' },
                ObjectProp1: { N: '1' },
                ObjectProp2: { S: 'abc' },
                ObjectProp3: { S: '2018-11-06T00:00:11.000Z' }
              }
            }
          },
          {
            PutRequest: {
              Item: {
                ObjectId: { S: '2' },
                ObjectProp1: { N: '1' },
                ObjectProp2: { S: 'def' },
                ObjectProp3: { S: '2018-11-06T00:00:33.000Z' }
              }
            }
          },
          {
            PutRequest: {
              Item: {
                ObjectId: { S: '3' },
                ObjectProp1: { N: '1' },
                ObjectProp2: { S: 'ghi' },
                ObjectProp3: { S: '2018-11-06T00:00:55.000Z' }
              }
            }
          }
        ];
  
        Dynamo = require('aws-sdk/clients/dynamodb');
        jest.mock('aws-sdk/clients/dynamodb');
        mockedDynamoDBBatchWriteItem = jest.fn().mockReturnValue({ promise: () => new Promise(() => {}) });
        Dynamo.mockImplementation(() => {
          return {
            batchWriteItem: mockedDynamoDBBatchWriteItem
          };
        });
      });
  
      test('Sending in an item list calls batchWriteItem', async () => {
        expect.hasAssertions();
        const actual = dynamoSut.batchPutObjects('tableName', []);
  
        expect(actual).toMatchObject(expect.any(Promise));
        expect(mockedDynamoDBBatchWriteItem).toBeCalledTimes(1);
      });
  
      test('Sending in an item list builds a Put Request list for batch write', async () => {
        expect.hasAssertions();
        dynamoSut.batchPutObjects('tableName', testItemList);
  
        expect(mockedDynamoDBBatchWriteItem).toBeCalledWith({
          RequestItems: {
            tableName: testPutRequestItems
          }
        });
      });
  
      test('An error occuring throws the correct error message', async () => {
        expect.hasAssertions();
  
        mockedDynamoDBBatchWriteItem = jest.fn().mockReturnValue({
          promise: jest.fn().mockRejectedValue({ message: 'error' })
        });
        DocumentClient.mockImplementation(() => {
          return {
            batchWriteItem: mockedDynamoDBBatchWriteItem
          };
        });
  
        await expect(dynamoSut.batchPutObjects('tableName', testItemList)).rejects.toBe('Error putting list of documents(batch) to dynamo. error');
      });
    });
  });
  