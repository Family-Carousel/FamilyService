'use script';

const dynamo = require('');
const Ajv = require('ajv');

module.exports = {
    createFamily: async (familyData) => {
        const shortid = require('shortid');
        const familySchema = require('../schemas/familySchema');

        familyData.id = shortid.generate();
        familyData.isActive = 1;

        try {
            const ajv = new Ajv();
            let valid = ajv.validate(familySchema, familyData);

            if (!valid) {
                console.log('Creating Family - Invalid Family Format: ' + ajv.errorsText());
                throw new error("Creating Family - Invalid Family Format");
            }
        } catch (err) {
            console.error('Failed to perform validation on family data: ' + err);
            throw('Failed to perform validation on family data');
        }

        try {
            const dynamoResponse = await dynamo.saveFamily(familyData);
            return dynamoResponse;
        } catch (err) {
            console.error('Failed to save family to data table: ' + err);
            throw('Failed to save family to data table');
        }
    },
};