import { defaultRegionParam } from "@aws-accounts/common";
import { createScope, HashMap, httpClient } from "@iyio/common";

export interface GetClientParamsOptions {
    envEndpoint?: string;
}

export async function getClientParamsAsync({
    envEndpoint = '/__DOT_ENV__.json'
}: GetClientParamsOptions = {}): Promise<HashMap<string> | undefined> {
    try {

        const scope = createScope();

        try {
            defaultRegionParam.require();
            return undefined;
        } catch {/* */}

        const envVars = await httpClient(scope).getAsync<HashMap<string>>(envEndpoint);

        if (!envVars) {
            throw new Error(`unableToLoadEnvVars url = ${envEndpoint}`);
        }

        return envVars;
    } catch {
        console.error(`config not found at ${envEndpoint}`);
        return undefined;
    }
}