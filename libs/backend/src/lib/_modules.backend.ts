import { awsRdsModule } from '@iyio/aws-rds';
import { EnvParams, ScopeRegistration } from "@iyio/common";
import { nodeCommonModule } from "@iyio/node-common";

export const backendModule=(reg:ScopeRegistration)=>{
    reg.addParams(new EnvParams());
    reg.use(awsRdsModule);
    reg.use(nodeCommonModule);
}
