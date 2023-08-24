import { ScopeRegistration, UserFactory } from "@iyio/common";
import { User } from "./User";

export const awsAcountsCommonModule = (scope: ScopeRegistration) => {
    scope.addFactory(UserFactory, options => new User(options) as any);
}