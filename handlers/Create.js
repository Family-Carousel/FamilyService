'use strict';

const utils = require('../handlers/utilities');
const familyService = require('../services/FamilyService');

const env = process.env.NODE_ENV;

module.exports = {
    createFamily: async (event) => {
        try {
            let familyData = JSON.parse(event.body);
            let response = await familyService.createFamily( familyData );

            if (response) {
                return utils.buildResponse(201, response);
            }

            return utils.buildResponse(400, 'Family not created')
        } catch (err) {
            console.error('Family Service Create a family error: ' + err);
            return utils.buildResponse(400, 'Family Service Create a family error');
        }
    }
};