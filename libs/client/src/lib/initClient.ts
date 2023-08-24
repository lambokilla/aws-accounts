import { createPromiseSource, HashMap, initRootScope, rootScope, ScopeModule, ScopeModulePriorities } from "@iyio/common";
import { clientModule } from "./_modules.client";

export const initClient = (staticParams?: HashMap<string>, waifForHydration = false, additionalModule?: ScopeModule) => {
    if (rootScope.isInited()) {
        return undefined;
    }

    try {
        const delaySource = createPromiseSource<void>();
        initRootScope(reg => {
            if (process.env['NODE_ENV'] !== 'production') {
                reg.addParams(staticParams);
            }
            if (waifForHydration) {
                reg.use({
                    priority: ScopeModulePriorities._10,
                    init: () => delaySource.promise,
                });
            } else {
                delaySource.resolve();
            }
            reg.use(clientModule);
            reg.use(additionalModule);
        });
        return delaySource;
    } catch(ex) {
        console.error('init root scope failed',ex);
    }
    return undefined;
}