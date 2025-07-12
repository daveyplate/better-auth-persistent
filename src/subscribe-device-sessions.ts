import { $authClient } from "./stores/auth-client"
import { $deviceSessions } from "./stores/device-sessions"
import { $persistentSession } from "./stores/persistent-session"

export function subscribeDeviceSessions() {
    const unsubscribe = $persistentSession.subscribe(
        ({ isPending, isRefetching, optimistic, data }) => {
            if (isPending || isRefetching || optimistic) return

            const deviceSessions = $deviceSessions.get()

            if (data) {
                deviceSessions.refetch()
            } else {
                $deviceSessions.set({
                    ...deviceSessions,
                    data: null,
                    isPending: false,
                    isRefetching: false,
                    error: null
                })
            }
        }
    )

    const checkActiveSession = () => {
        const persistentSession = $persistentSession.get()
        if (!persistentSession.optimistic || !persistentSession.data) return

        const authClient = $authClient.get()
        if (!authClient) return

        authClient.multiSession
            .setActive({
                sessionToken: persistentSession.data.session.token
            })
            .then((result) => {
                if (result.error) return

                persistentSession.refetch()
            })
    }

    checkActiveSession()

    window.addEventListener("online", checkActiveSession)

    return () => {
        unsubscribe()
        window.removeEventListener("online", checkActiveSession)
    }
}
