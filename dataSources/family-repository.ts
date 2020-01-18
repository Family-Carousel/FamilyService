'use strict';

const dynamoUtils = require('./dynamo.utilities');
const tableName = process.env.FAMILY_TABLE;
// const _ = require('lodash');

// TODO: Convert for batch put of family's if ever needed
// function buildPutRequestItemListOfTemplates(templateItemList, newTemplateName) {
//     let updatedTemplates = _.map(templateItemList, (t) => {
//       let newPutRequestObject = {
//         LastUpdateBy: { S: t.LastUpdateBy.toString() },
//         IsTrackingPixel: { N: t.IsTrackingPixel.toString() },
//         IsActive: { N: t.IsActive.toString() },
//         IsResendable: { N: t.IsResendable.toString() },
//         CreatedDateTime: { S: t.CreatedDateTime },
//         VersionId: { S: t.VersionId },
//         LastUpdateDateTime: { S: t.LastUpdateDateTime },
//         CreatedBy: { S: t.CreatedBy.toString() },
//         Id: { S: t.Id },
//         IsOnDoNotSendList: { N: t.IsOnDoNotSendList.toString() },
//         ApplicationId: { S: t.ApplicationId },
//         DefaultEmailAddresses: { M: { From: { S: t.DefaultEmailAddresses.From }, Bcc: { SS: t.DefaultEmailAddresses.Bcc }, Cc: { SS: t.DefaultEmailAddresses.Cc }, To: { SS: t.DefaultEmailAddresses.To } } }
//       };

//       if (t.Path) {
//         newPutRequestObject.Path = { S: t.Path };
//       }

//       if (t.Stages && t.Stages.length) {
//         newPutRequestObject.Stages = { SS: t.Stages };
//       }

//       if (t.Description) {
//         newPutRequestObject.Description = { S: t.Description };
//       }

//       if (t.Subject) {
//         newPutRequestObject.Subject = { S: t.Subject };
//       }

//       if (newTemplateName !== t.Name) {
//         newPutRequestObject.Name = { S: newTemplateName };
//       } else {
//         newPutRequestObject.Name = { S: t.Name };
//       }
//       console.log('nameUpdateNewPutRequestObject', JSON.stringify(newPutRequestObject));

//       return newPutRequestObject;
//     });

//     return updatedTemplates;
//   }

class FamilyRepo {

    public async saveFamily(familyData: any) {
        try {
            const response = await dynamoUtils.putObject(tableName, familyData);
            return response;
        } catch (err) {
            console.error('Error updating family via Dynamo: ', err);
            throw new Error('Error updating family via Dynamo');
        }
    }
}

export const familyRepo = new FamilyRepo();

// module.exports = {
//     getFamilyById: async (FamilyId) => {
//         try {
//             return await dynamoUtils.getByHashKey(tableName, { FamilyId: FamilyId });
//         } catch(err) {
//             console.error('Error getting family by id via Dynamo: ' + err);
//             throw('Error getting family');
//         }
//     },
//     listFamilysByMemberId: async (memberId) => {
//         try {
//             let qobj = dynamoUtils.paramsObjectFactory(tableName, "MemberId_IDX", "MemberId", memberId);
//             return await dynamoUtils.query(qobj);
//         } catch(err) {
//             console.error('Error listing familys by memberId via Dynamo: ' + err);
//             throw('Error listing familys by memberId');
//         }
//     }
// };