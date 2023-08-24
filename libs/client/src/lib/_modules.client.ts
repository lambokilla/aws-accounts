import { awsAcountsCommonModule } from "@aws-accounts/common";
import { awsModule } from "@iyio/aws";
import { cognitoAuthProviderModule } from "@iyio/aws-credential-providers";
import { LocalStorageStore, ScopeModulePriorities, ScopeRegistration, authService, isServerSide, storeRoot } from "@iyio/common";
import { nextJsModule } from "@iyio/nextjs-common";
import { getClientParamsAsync } from "./getClientParamsAsync";


export const clientModule = (reg: ScopeRegistration) => {
    if (isServerSide) {
        return;
    }

    reg.use(awsAcountsCommonModule);

    reg.use(cognitoAuthProviderModule);

    reg.use(awsModule);

    reg.use(nextJsModule);

    // reg.implementClient(sqlClient, scope => SqlHttpClient.fromScope( scope, {
    //     url: rdsF
    // }))

    reg.use({
        priority: ScopeModulePriorities.config,
        init: async () => {
            const params = await getClientParamsAsync();
            if (params) {
                reg.addParams(params);
            }
        }
    });

    reg.use({
        priority: ScopeModulePriorities.types,
        init: scope => {
            storeRoot(scope).mount('/', new LocalStorageStore({keyPrefix: 'awsAccounts::'}));
        }
    });

    reg.use({
        priority: ScopeModulePriorities._2,
        init: async scope => {
            await authService(scope).init();
        }
    });
}