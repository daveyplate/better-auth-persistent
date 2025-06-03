import { useEffect } from "react"
import { subscribePersistSession } from "./subscribe-persist-session"
import type { AnyAuthClient } from "./types/any-auth-client"

export function usePersistSession(authClient: AnyAuthClient) {
    useEffect(() => subscribePersistSession(authClient), [authClient])
}
