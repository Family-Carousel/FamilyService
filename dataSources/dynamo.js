'use strict';

const dynamoUtils = require('../dataSources/dynamo.utilities');
const tableName = process.env.FAMILY_TABLE;

module.exports = {
    saveFamily: async (familyData) => {
        try {
            console.log('we made it to the dynamo put');
            const returnValue = await dynamoUtils.putObject(tableName, familyData);
            console.log('returnValue: ', returnValue);
            return returnValue;
        } catch (err) {
            console.error('Error updating family via Dynamo: ' + err);
            throw('Error updating family via Dynamo');
        }
    },
    getFamilyById: async (FamilyId) => {
        try {
            return await dynamoUtils.getByHashKey(tableName, { FamilyId: FamilyId });
        } catch(err) {
            console.error('Error getting family by id via Dynamo: ' + err);
            throw('Error getting family');
        }
    },
    listFamilysByMemberId: async (memberId) => {
        try {
            let qobj = dynamoUtils.paramsObjectFactory(tableName, "MemberId_IDX", "MemberId", memberId);
            return await dynamoUtils.query(qobj);
        } catch(err) {
            console.error('Error listing familys by memberId via Dynamo: ' + err);
            throw('Error listing familys by memberId');
        }
    }
};