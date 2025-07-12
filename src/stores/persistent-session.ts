import type { BetterFetchError } from "@better-fetch/fetch"
import { persistentAtom } from "@nanostores/persistent"
import type { Session, User } from "better-auth"
import SuperJSON from "superjson"
import { $authClient } from "./auth-client"

type PersistentSessionResult = {
    data: { session: Session; user: User } | null
    isPending: boolean
    isRefetching: boolean
    optimistic?: boolean
    error: BetterFetchError | null
    refetch: () => Promise<void>
}

export const $persistentSession = persistentAtom<PersistentSessionResult>(
    "session",
    {
        data: null,
        isPending: false,
        isRefetching: false,
        error: null,
        refetch: async () => {}
    },
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
                        data: null,
                        isRefetching: false,
                        isPending: false,
                        error: result.error as BetterFetchError
                    })
                } else {
                    $persistentSession.set({
                        ...$persistentSession.get(),
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
