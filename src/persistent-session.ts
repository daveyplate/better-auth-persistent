import { persistentAtom } from "@nanostores/persistent"
import type { Session, User } from "better-auth"
import SuperJSON from "superjson"

type PersistentSessionResult = {
    data: { session: Session; user: User } | null
    isPending: boolean
    isRefetching: boolean
    optimistic?: boolean
    error: Error | null
    refetch: undefined
}

export const $persistentSession = persistentAtom<PersistentSessionResult>(
    "session",
    {
        data: null,
        isPending: true,
        isRefetching: true,
        error: null,
        refetch: undefined
    },
    {
        encode: SuperJSON.stringify,
        decode: SuperJSON.parse
    }
)
