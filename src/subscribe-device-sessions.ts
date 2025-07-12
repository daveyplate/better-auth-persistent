import { $deviceSessions } from "./stores/device-sessions"
import { $persistentSession } from "./stores/persistent-session"

export function subscribeDeviceSessions() {
    const unsubscribe = $persistentSession.subscribe((sessionData) => {
        if (sessionData.isPending || sessionData.isRefetching) return

        if (sessionData.data) {
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

    return () => {
        unsubscribe()
    }
}
