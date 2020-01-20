import { IFamily } from '../interfaces/IFamily';
import { familyRepo } from '../dataSources/family-repository';
import { caseTsJsonValidator } from '../schemas/familySchema';
// import * as shortid from 'shortid';

class FamilyService {
    
    public async createFamily(familyData: IFamily) {
        if (!familyData) {
            return;
        }

        // familyData.Id = shortid.generate();
        familyData.Id = "1"
        familyData.IsActive = 1;

        // try {
        //     let valid = caseTsJsonValidator(familyData);

        //     if (!valid) {
        //         console.log('Creating Family - Invalid Family Format');
        //         throw new Error("Creating Family - Invalid Family Format");
        //     }
        // } catch (err) {
        //     console.error('Failed to perform validation on family data: ', err);
        //     throw new Error('Failed to perform validation on family data');
        // }

        try {
            const response = await familyRepo.saveFamily(familyData);
            return response;
        } catch (err) {
            console.error('Failed to save family to data table: ', err);
            throw new Error('Failed to save family to data table');
        }
    }
}

export const familyService = new FamilyService();

// module.exports = {
//     getFamilyByFamilyId: async (FamilyId) => {
//         try {
//             const family = await dynamo.getFamilyById(FamilyId);
//             return family;
//         } catch (err) {
//             console.error("Error: " + err);
//             throw("Failed to get Family");
//         }
//     },
//     listFamilysByMemberId: async (memberId) => {
//         try {
//             const family = await dynamo.listFamilysByMemberId(memberId);
//             return family;
//         } catch (err) {
//             console.error("Error: " + err);
//             throw("Failed to get Family by memberId");
//         }
//     },
//     updateFamily: async (familyData) => {
//         const familySchema = require("../schemas/familySchema");

//         try {
//             const ajv = new Ajv();
//             let valid = ajv.validate(familySchema, familyData);

//             if (!valid) {
//                 console.error("Updating Family - Invalid Family Format: " + ajv.errorsText());
//                 throw("Updating Family - Invalid Family Format");
//             }
//         } catch (err) {
//             console.error("Error Validating Family Data: " + err);
//             throw("Error validating family data");
//         }

//         try {
//             const dynamoResponse = await dynamo.saveFamily(familyData);
//             return dynamoResponse;
//         } catch (err) {
//             console.error("Updating family error: " + err);
//             throw("Failed to update family");
//         }
//     },
//     deleteFamily: async (familyId) => {
//         try {
//             const family = await dynamo.getFamilyById(familyId);
//             family.IsActive = 0;

//             const dynamoResponse = await dynamo.saveFamily(family);
//             return dynamoResponse;
//         } catch (err) {
//             console.error("Family inactive error/Delete error: " + err);
//             throw("Error deleting family");
//         }
//     }
// };