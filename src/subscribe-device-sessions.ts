import { $authClient } from "./stores/auth-client"
import { $deviceSessions } from "./stores/device-sessions"
import { $persistentSession } from "./stores/persistent-session"

export function subscribeDeviceSessions() {
    const unsubscribe = $persistentSession.subscribe((persistentSession) => {
        if (
            persistentSession.isPending ||
            persistentSession.isRefetching ||
            persistentSession.optimistic
        )
            return

        if (persistentSession.data) {
            $deviceSessions.get().refetch()
        } else {
            $deviceSessions.set({
                ...$deviceSessions.get(),
                data: null,
                isPending: false,
                isRefetching: false,
                error: null
            })
        }
    })

    const checkActiveSession = () => {
        const persistentSession = $persistentSession.get()
        if (persistentSession.optimistic && persistentSession.data) {
            $authClient
                .get()
                ?.multiSession.setActive({
                    sessionToken: persistentSession.data.session.token
                })
                .then((result) => {
                    if (result.error) return

                    $persistentSession.get().refetch()
                })
        }
    }

    checkActiveSession()

    window.addEventListener("online", checkActiveSession)

    return () => {
        window.removeEventListener("online", checkActiveSession)
        unsubscribe()
    }
}
