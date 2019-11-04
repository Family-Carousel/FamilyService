'use strict'

const utils = require('../handlers/utilities');
const familyService = require('../services/FamilyService');

const env = process.env.NODE_ENV;

module.exports = {

    updateFamily: async (event) => {
        try {
            let familyData = JSON.parse(event.body);
            let family = await familyService.updateFamily( familyData );

            if (family) {
                return utils.buildResponse(201, family);
            }

            return utils.buildResponse(400, 'family not updated')
        } catch (err) {
            console.error('Family Service family update failure: ' + err);
            return utils.buildResponse(400, 'Family Service family update failure');
        }
    }
}