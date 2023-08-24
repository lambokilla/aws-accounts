import { initRootScope, ScopeModule } from "@iyio/common";
import { backendModule } from "./_modules.backend";

export const initBackend=(additionalModule?:ScopeModule)=>{
    initRootScope(reg=>{
        reg.use(backendModule);
        reg.use(additionalModule);
    })
}