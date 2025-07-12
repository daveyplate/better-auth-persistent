import { $authClient } from "./stores/auth-client"
import { $persistentSession } from "./stores/persistent-session"
import type { AnyAuthClient } from "./types/any-auth-client"
import type { AuthClient } from "./types/auth-client"

export function initPersistSession(authClient: AnyAuthClient) {
    if ($authClient.get()) return

    $authClient.set(authClient as AuthClient)
    const sessionResult = $persistentSession.get()

    if (sessionResult.data) sessionResult.refetch()
}
