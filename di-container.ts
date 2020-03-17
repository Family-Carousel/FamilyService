import { Container } from 'inversify';

import { FamilyRepo } from './dataSources/family-repository';
import { MemberRepo } from './dataSources/member-repository';

import { FamilyService } from './services/FamilyService';
import { MemberService } from './services/MemberService';

import { DynamoUtilities } from './dataSources/dynamo.utilities';

var DIContainer = new Container();

DIContainer.bind<FamilyRepo>(FamilyRepo).toSelf();
DIContainer.bind<MemberRepo>(MemberRepo).toSelf();

DIContainer.bind<FamilyService>(FamilyService).toSelf();
DIContainer.bind<MemberService>(MemberService).toSelf();

DIContainer.bind<DynamoUtilities>(DynamoUtilities).toSelf();

export default DIContainer;
