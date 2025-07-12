import { $deviceSessions } from "./stores/device-sessions"
import { $persistentSession } from "./stores/persistent-session"
import { authClient } from "./types/auth-client"

export async function setActiveSession({
    sessionToken
}: {
    sessionToken: string
}) {
    const deviceSessions = $deviceSessions.get()

    const session = deviceSessions.data?.find(
        (session) => session.session.token === sessionToken
    )

    if (!session)
        throw {
            error: {
                message: "Invalid session token",
                code: "INVALID_SESSION_TOKEN"
            }
        }

    $persistentSession.set({
        ...$persistentSession.get(),
        data: session,
        isPending: false,
        isRefetching: false,
        error: null
    })

    authClient.multiSession.setActive({
        sessionToken: session.session.token
    })
}
