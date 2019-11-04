'use strict';

const utils = require('./utilities');
const familyService = require('../services/FamilyService');

const env = process.env.NODE_ENV;

module.exports = {
    getPhotoByFamilyId: async (event) => {
        try {
            let familyId = event.pathParameters.familyId;
            let photo = await familyService.getPhotoByFamilyId( familyId );

            if (response) {
                return utils.buildResponse(200, response);
            }

            return utils.buildResponse(404, 'Photo not found')
        } catch (err) {
            console.error('Family Service Get Photo Error: ' + err);
            return utils.buildResponse(400, 'Failed to get Family Photo');
        }
    }
};