import { persistentAtom } from "@nanostores/persistent"
import type { Session, User } from "better-auth"
import { computed, task } from "nanostores"
import SuperJSON from "superjson"
import { $authClient } from "./auth-client-store"
import { $persistentSession } from "./persistent-session"

type DeviceSessionsResult = {
	data: { session: Session; user: User }[] | null
	isPending: boolean
	error: Error | null
}

export const emptyResponse = {
	data: null,
	isPending: true,
	isRefetching: true,
	error: null,
	refetch: undefined
}

const $persistentSessions = persistentAtom<DeviceSessionsResult>(
	"device-sessions",
	emptyResponse,
	{
		encode: SuperJSON.stringify,
		decode: SuperJSON.parse
	}
)

export const $freshSessions = computed(
	[$authClient, $persistentSession],
	(authClient, persistentSession) =>
		task(async () => {
			if (!authClient) return emptyResponse
			if (!persistentSession.data) return emptyResponse

			try {
				const deviceSessions =
					await // biome-ignore lint/suspicious/noExplicitAny: Any
					(authClient as any).multiSession.listDeviceSessions({
						fetchOptions: { throw: true }
					})

				return {
					data: deviceSessions,
					isPending: false,
					isRefetching: false,
					error: null,
					refetch: undefined
				}
			} catch (error) {
				return {
					data: null,
					isPending: false,
					isRefetching: false,
					error: error as Error,
					refetch: undefined
				}
			}
		})
)

export const $deviceSessions = computed(
	[$persistentSession, $persistentSessions, $freshSessions],
	(persistentSession, persistentSessions, freshSessions) => {
		if (persistentSession.isPending) return emptyResponse
		if (!freshSessions) return persistentSessions

		if (!persistentSession.data) {
			$persistentSessions.set(emptyResponse)
		} else if (
			freshSessions.data ||
			(!persistentSessions.data && freshSessions.error)
		) {
			$persistentSessions.set(freshSessions)
		}

		return $persistentSessions.get()
	}
)
