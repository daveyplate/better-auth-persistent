import type { BetterFetchError } from "@better-fetch/fetch"
import { persistentAtom } from "@nanostores/persistent"
import type { Session, User } from "better-auth"
import SuperJSON from "superjson"
import { emptyResult } from "../empty-result"
import { $authClient } from "./auth-client"

type DeviceSessionsResult = {
    data: { session: Session; user: User }[] | null
    isPending: boolean
    isRefetching: boolean
    error: BetterFetchError["error"] | null
    refetch: () => Promise<void>
}

export const $deviceSessions = persistentAtom<DeviceSessionsResult>(
    "device-sessions",
    { ...emptyResult, isPending: false },
    {
        encode: SuperJSON.stringify,
        decode: (value) => {
            const parsed = SuperJSON.parse(value) as DeviceSessionsResult

            parsed.refetch = async () => {
                const authClient = $authClient.get()

                if (!authClient) {
                    console.warn("$authClient not found")
                    return
                }

                $deviceSessions.set({
                    ...$deviceSessions.get(),
                    isRefetching: true
                })

                const result =
                    await authClient.multiSession.listDeviceSessions()

                if (result.error) {
                    $deviceSessions.set({
                        ...$deviceSessions.get(),
                        data: null,
                        isRefetching: false,
                        isPending: false,
                        error: result.error
                    })
                } else {
                    $deviceSessions.set({
                        ...$deviceSessions.get(),
                        data: result.data,
                        isRefetching: false,
                        isPending: false,
                        error: null
                    })
                }
            }

            return parsed
        }
    }
)
