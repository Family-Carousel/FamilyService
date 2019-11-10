'use strict'

const utils = require('../handlers/utilities');
const familyService = require('../services/FamilyService');

const env = process.env.NODE_ENV;

module.exports = {

    listFamilyByMemberId: async (event) => {
        try {
            let familyId = event.pathParameters.familyId;
            let families = await familyService.listFamilysByMemberId( familyId );

            if (families) {
                return utils.buildResponse(200, families);
            }

            return utils.buildResponse(404, 'family not found')
        } catch (err) {
            console.error('Family Service Get families Error: ' + err);
            return utils.buildResponse(400, 'Failed to get list of families by member Id');
        }
    },
    getFamilyByFamilyId: async (event) => {
        try {
            let familyId = event.pathParameters.familyId;
            let family = await familyService.getFamilyByFamilyId( familyId );

            if (family) {
                return utils.buildResponse(200, family);
            }

            return utils.buildResponse(404, 'family not found')
        } catch (err) {
            console.error('Family Service Get family Error: ' + err);
            return utils.buildResponse(400, 'Failed to get list of family by Id');
        }
    },
    

}