import { IFamily } from '../interfaces/IFamily';
import { IMember } from '../interfaces/IMember';
import { Family } from '../models/Family';
import { familyRepo } from '../dataSources/family-repository';
import { caseTsJsonValidator } from '../schemas/familySchema';

class FamilyService {
    
    public async createFamily(familyData: IFamily): Promise<IFamily> {
        familyData.IsActive = true;

        const newFamily = new Family(familyData);

        try {
            let valid = caseTsJsonValidator(newFamily);

            if (!valid) {
                console.log('Creating Family - Invalid Family Format');
                throw new Error("Creating Family - Invalid Family Format");
            }
        } catch (err) {
            console.error('Failed to perform validation on family data: ', err);
            throw new Error('Failed to perform validation on family data');
        }

        try {
            const response = await familyRepo.SaveFamily(newFamily);
            return response as IFamily;
        } catch (err) {
            console.error('Failed to save family to data table: ', err);
            throw new Error('Failed to save family to data table');
        }
    }

    public async GetFamilyById(id: string): Promise<IFamily> {
        try {
            const family = await familyRepo.GetFamilyById(id);
            return family as IFamily;
        } catch(err) {
            console.error('Failed to get family by id: ', err);
            throw new Error('Failed to get family by id');
        }
    }

    public async ListFamilysForEachMember(members: IMember[]): Promise<IFamily[]> {
        let familys: IFamily[] = [];
        try {
            for (let m = 0; m < members.length; m ++) {
                let family = await this.GetFamilyById(members[m].FamilyId);
                familys.push(family as IFamily);
            }
            return familys as IFamily[];
        } catch (err) {
            console.error('Error listing families for members: ', err);
            throw new Error('Error listing families for members');
        }        
    }

    public async DeleteFamily(id: string): Promise<boolean> {
        if (!id) {
            return false;
        }

        try {
            await familyRepo.DeleteFamily(id);
            return true;
        } catch (err) {
            console.error('Error Deleting family: ', err);
            throw new Error('Error Deleting family');
        }
    }

    public async UpdateFamily(currentFamily: IFamily, newFamilyData: IFamily): Promise<IFamily> {
        const updateFamily = new Family(newFamilyData);

        try {
            let valid = caseTsJsonValidator(updateFamily);

            if (!valid) {
                console.log('Updating Family - Invalid Family Format');
                throw new Error("Updating Family - Invalid Family Format");
            }
        } catch (err) {
            console.error('Failed to perform validation on family data: ', err);
            throw new Error('Failed to perform validation on family data');
        }

        try {
            const response = await familyRepo.SaveFamily(updateFamily);
            return response as IFamily;
        } catch (err) {
            console.error('Failed to save family to data table: ', err);
            throw new Error('Failed to save family to data table');
        }
    }
}

export const familyService = new FamilyService();

//         try {
//             const dynamoResponse = await dynamo.saveFamily(familyData);
//             return dynamoResponse;
//         } catch (err) {
//             console.error("Updating family error: " + err);
//             throw("Failed to update family");
//         }
//     },
