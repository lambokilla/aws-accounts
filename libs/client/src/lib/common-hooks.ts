import { User } from "@aws-accounts/common";
import { HashMap, ScopeModule, currentBaseUser, isServerSide } from "@iyio/common";
import { useSubject } from "@iyio/react-common";
import { useEffect, useMemo, useRef, useState } from "react";
import { initClient } from "./initClient";


export function useUser(): User | null {
    return useSubject(currentBaseUser.subject) as User | null;
}

export function useInitApp(staticEnvVars?: HashMap<string>, waitForHydration = false, additionalModule?: ScopeModule) {
    const [inited, setInited] = useState(isServerSide);

    const initRef = useRef({ staticEnvVars, waitForHydration, additionalModule });
    const resumeInit = useMemo(() => initClient(
        initRef.current.staticEnvVars,
        initRef.current.waitForHydration,
        initRef.current.additionalModule
    ), []);

    useEffect(() => {
        if (isServerSide) {
            return;
        }
    })
}