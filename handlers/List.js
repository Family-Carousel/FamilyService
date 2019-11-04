'use strict'

const utils = require('../handlers/utilities');
const familyService = require('../services/FamilyService');

const env = process.env.NODE_ENV;

module.exports = {

    listFamilyByMemberId: async (event) => {
        try {
            let families = await familyService.listFamilysByMemberId( event.queryStringParameters.memberId );

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
            let family = await familyService.getFamilyByFamilyId( event.pathParameters.familyId );

            if (family) {
                return utils.buildResponse(200, family);
            }

            return utils.buildResponse(404, 'family not found')
        } catch (err) {
            console.error('Family Service Get familt Error: ' + err);
            return utils.buildResponse(400, 'Failed to get list of family by Id');
        }
    },
    

}