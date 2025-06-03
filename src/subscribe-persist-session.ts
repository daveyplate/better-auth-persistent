import type { Session, User } from "better-auth"
import SuperJSON from "superjson"
import { $authClient } from "./auth-client-store"
import { $persistentSession } from "./persistent-session"
import type { AnyAuthClient } from "./types/any-auth-client"
import type { AuthClient } from "./types/auth-client"

type SessionData = { session: Session; user: User }

export function subscribePersistSession(authClient: AnyAuthClient) {
    if (!$authClient.get()) {
        $authClient.set(authClient)
    }

    const persistSession = () => {
        const value = authClient.$store.atoms.session.get()
        const sessionData = value?.data as SessionData | null
        const persistentSessionData = $persistentSession.get()?.data

        if (
            !persistentSessionData ||
            (!sessionData && !value?.error) ||
            (sessionData &&
                SuperJSON.stringify(sessionData) !==
                    SuperJSON.stringify(persistentSessionData))
        ) {
            $persistentSession.set(value)
        }
    }

    const restoreSession = () => {
        const value = authClient.$store.atoms.session.get()
        const sessionData = value?.data as SessionData | null
        const persistentValue = $persistentSession.get()
        const persistentSessionData = $persistentSession.get()?.data

        if (!persistentSessionData) return

        if (
            !sessionData ||
            persistentSessionData.user.id !== sessionData.user.id
        ) {
            if (sessionData) {
                console.log("set active session", {
                    sessionToken: persistentSessionData.session.token
                })
            }

            authClient.$store.atoms.session.set({
                ...persistentValue,
                refetch: value?.refetch
            })
        }
    }

    const unbindPersistentSessionListener = $persistentSession.subscribe(() => {
        restoreSession()
    })

    const unbindSessionListener = authClient.$store.atoms.session.subscribe(
        () => {
            persistSession()
            restoreSession()
        }
    )

    const checkActiveSession = () => {
        const persistentSession = $persistentSession.get()
        if (persistentSession.optimistic && persistentSession.data) {
            ;(authClient as AuthClient).multiSession.setActive({
                sessionToken: persistentSession.data.session.token
            })
        }
    }

    window.addEventListener("online", checkActiveSession)

    return () => {
        unbindSessionListener()
        unbindPersistentSessionListener()
    }
}
