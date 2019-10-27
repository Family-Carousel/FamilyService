'use strict';

const dynamoUtils = require('../dataSources/dynamo.utilities');
const tableName = process.env.FAMILY_TABLE;

module.exports = {
    saveFamily: async (familyData) => {
        try {
            return await dynamoUtils.putObject(tableName, familyData);
        } catch (err) {
            console.error('Error updating family via Dynamo: ' + err);
            throw('Error updating family via Dynamo');
        }
    }
};