import { IFamily } from '../interfaces/IFamily';
import { IMember } from '../interfaces/IMember';
import { Family } from '../models/Family';
import { FamilyRepo } from '../dataSources/family-repository';
import { caseTsJsonValidator } from '../schemas/familySchema';
import { inject, injectable } from 'inversify';
import { uniqBy } from 'lodash';

@injectable()
export class FamilyService {
    protected _familyRepo: FamilyRepo;

    constructor(@inject(FamilyRepo) familyRepo: FamilyRepo) {
        this._familyRepo = familyRepo;
    }
    
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
            const response = await this._familyRepo.SaveFamily(newFamily);
            return response as IFamily;
        } catch (err) {
            console.error('Failed to save family to data table: ', err);
            throw new Error('Failed to save family to data table');
        }
    }

    public async ListFamilysByOwningMember(memberId: string): Promise<IFamily[]> {
        try {
            const familys = await this._familyRepo.ListFamilysByFamilyOwner(memberId);
            return familys as IFamily[]
        } catch (err) {
            console.error('Failed to get family by owning member: ', err);
            throw new Error('Failed to get family by owning member');
        }
    }

    public async GetFamilyById(id: string): Promise<IFamily> {
        try {
            const family = await this._familyRepo.GetFamilyById(id);
            return family as IFamily;
        } catch(err) {
            console.error('Failed to get family by id: ', err);
            throw new Error('Failed to get family by id');
        }
    }

    public async RemoveFamilyDupsFromFamilyList(familyList: IFamily[]): Promise<IFamily[]> {
        try {
             const editedFamilyList = uniqBy(familyList, 'Id');
             return editedFamilyList as IFamily[];
        } catch (err) {
            console.error('Failed to dedup family list: ', err);
            throw new Error('Failed to dedup family list');
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
            await this._familyRepo.DeleteFamily(id);
            return true;
        } catch (err) {
            console.error('Error Deleting family: ', err);
            throw new Error('Error Deleting family');
        }
    }

    public async UpdateFamily(currentFamily: IFamily, newFamilyData: IFamily): Promise<IFamily> {
        newFamilyData.CreateBy = currentFamily.CreateBy;
        newFamilyData.CreateDateTime = newFamilyData.CreateDateTime;
        
        const updateFamily = new Family(newFamilyData);

        if (updateFamily === currentFamily) {
            throw new Error('Update not needed, Current Matches new data');
        }

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
            const response = await this._familyRepo.SaveFamily(updateFamily);
            return response as IFamily;
        } catch (err) {
            console.error('Failed to save family to data table: ', err);
            throw new Error('Failed to save family to data table');
        }
    }
}
