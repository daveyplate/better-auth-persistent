import { useStore } from "@nanostores/react"
import { useEffect, useMemo } from "react"
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
            : {
                  data: null,
                  isPending: true,
                  isRefetching: false,
                  error: null,
                  refetch: () => {}
              }
    }, [isHydrated, store])

    return result
}
