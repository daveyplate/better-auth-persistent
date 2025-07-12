import { useStore } from "@nanostores/react"
import { useEffect, useMemo } from "react"
import { emptyResult } from "../empty-result"
import { initPersistSession } from "../init-persist-session"
import { $persistentSession } from "../stores/persistent-session"
import type { AnyAuthClient } from "../types/any-auth-client"
import { useIsHydrated } from "./use-hydrated"

export function useSession<TAuthClient extends AnyAuthClient>(
    authClient: TAuthClient
) {
    const isHydrated = useIsHydrated()
    const store = useStore($persistentSession)

    useEffect(() => {
        if (authClient) initPersistSession(authClient)
    }, [authClient])

    const result = useMemo(() => {
        return isHydrated
            ? {
                  ...store,
                  data: store.data as TAuthClient["$Infer"]["Session"] | null
              }
            : emptyResult
    }, [isHydrated, store])

    return result
}
