'use strict';

const utils = require('./utilities');
const familyService = require('../services/FamilyService');

const env = process.env.NODE_ENV;

module.exports = {
    deleteFamily: async (event) => {
        try {
            let familyId = event.pathParameters.familyId;
            let response = await familyService.deleteFamily( familyId );

            if (response) {
                return utils.buildResponse(201, response);
            }

            return utils.buildResponse(400, 'Family not deleted')
        } catch (err) {
            console.error('Family Service delete family error: ' + err);
            return utils.buildResponse(400, 'Family Service delete family error');
        }
    }
};