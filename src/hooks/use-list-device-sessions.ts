import { useStore } from "@nanostores/react"
import { useMemo } from "react"
import { emptyResult } from "../empty-result"
import { $deviceSessions } from "../stores/device-sessions"
import type { AnyAuthClient } from "../types/any-auth-client"
import { useIsHydrated } from "./use-hydrated"

export function useListDeviceSessions<TAuthClient extends AnyAuthClient>(
    _?: TAuthClient
) {
    const isHydrated = useIsHydrated()
    const store = useStore($deviceSessions)

    const result = useMemo(() => {
        return isHydrated
            ? {
                  ...store,
                  data: store.data as TAuthClient["$Infer"]["Session"][] | null
              }
            : emptyResult
    }, [isHydrated, store])

    return result
}
