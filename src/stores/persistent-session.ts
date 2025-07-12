import type { BetterFetchError } from "@better-fetch/fetch"
import { persistentAtom } from "@nanostores/persistent"
import type { Session, User } from "better-auth"
import SuperJSON from "superjson"
import { emptyResult } from "../empty-result"
import { $authClient } from "./auth-client"

type PersistentSessionResult = {
    data: { session: Session; user: User } | null
    isPending: boolean
    isRefetching: boolean
    optimistic?: boolean
    error: BetterFetchError["error"] | null
    refetch: () => Promise<void>
}

export const $persistentSession = persistentAtom<PersistentSessionResult>(
    "session",
    { ...emptyResult, isPending: false },
    {
        encode: SuperJSON.stringify,
        decode: (value) => {
            const parsed = SuperJSON.parse(value) as PersistentSessionResult

            parsed.refetch = async () => {
                const authClient = $authClient.get()

                if (!authClient) {
                    console.warn("$authClient not found")
                    return
                }

                $persistentSession.set({
                    ...$persistentSession.get(),
                    isRefetching: true
                })

                const result = await authClient.getSession()

                if (result.error) {
                    $persistentSession.set({
                        ...$persistentSession.get(),
                        isRefetching: false,
                        isPending: false,
                        error: result.error
                    })
                } else {
                    $persistentSession.set({
                        ...$persistentSession.get(),
                        optimistic: false,
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
