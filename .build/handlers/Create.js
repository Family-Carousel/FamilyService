"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const utils = require('../handlers/utilities');
const familyService_1 = require("../services/familyService");
let familyData;
let serverReturn;
exports.createFamily = async (event, context) => {
    try {
        if (!event.body) {
            return utils.buildResponse(400, JSON.stringify('Object to create was not provided'));
        }
        familyData = JSON.parse(event.body);
        serverReturn = await familyService_1.familyService.createFamily(familyData);
        if (!serverReturn) {
            return utils.buildResponse(404, JSON.stringify('Failed to create Family'));
        }
        return utils.buildResponse(201, JSON.stringify(serverReturn));
    }
    catch (err) {
        console.error('Family Service Create a family error: ', err);
        return utils.buildResponse(500, JSON.stringify('Family Service internal server error'));
    }
};
//# sourceMappingURL=Create.js.map