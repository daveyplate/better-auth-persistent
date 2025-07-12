import { useStore } from "@nanostores/react"
import { useMemo } from "react"
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
                  data: store.data as Array<
                      TAuthClient["$Infer"]["Session"]
                  > | null
              }
            : {
                  data: null,
                  isPending: true,
                  isRefetching: false,
                  error: null,
                  refetch: async () => {}
              }
    }, [isHydrated, store])

    return result
}
