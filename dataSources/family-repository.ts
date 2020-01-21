'use strict';
import { DynamoUtils } from './dynamo.utilities';
import { IFamily } from '../interfaces/IFamily';
// import { map } from 'lodash';
const tableName: string = process.env.FAMILY_TABLE || 'devFamilyTable';

// TODO: Convert for batch put of family's if ever needed
// function buildPutRequestItemListOfTemplates(templateItemList, newTemplateName) {
//     let updatedTemplates = map(templateItemList, (t) => {
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

    public async SaveFamily(familyData: IFamily) {
        try {
            const response = await DynamoUtils.PutItem(tableName, familyData);
            return response;
        } catch (err) {
            console.error('Error updating family via Dynamo: ', err);
            throw new Error('Error updating family via Dynamo');
        }
    }

    public async DeleteFamily(familyId: string) {
        try {
            const response = await DynamoUtils.DeleteItem(tableName, familyId);
            return response;
        } catch (err) {
            console.error('Error updating family via Dynamo: ', err);
            throw new Error('Error updating family via Dynamo');
        }
    }

    public async GetFamilyById(id: string) {
        try {
            return await DynamoUtils.Query(tableName, 'Id', id);
        } catch (err) {
            console.error('Error getting family by id via Dynamo: ' + err);
            throw ('Error getting family');
        }
    }

    public async ListFamilyByMemberId(memberId: string) {
        try {
            return await DynamoUtils.Query(tableName, 'MemberId', memberId, 'MemberId_IDX');
        } catch (err) {
            console.error('Error listing familys by memberId via Dynamo: ' + err);
            throw ('Error listing familys by memberId');
        }
    }
}

export const familyRepo = new FamilyRepo();
