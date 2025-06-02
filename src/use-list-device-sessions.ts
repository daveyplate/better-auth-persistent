import { useStore } from "@nanostores/react"
import { $deviceSessions, emptyResponse } from "./device-sessions"
import { useIsHydrated } from "./hooks/use-hydrated"

export function useListDeviceSessions() {
	const isHydrated = useIsHydrated()
	const result = useStore($deviceSessions)

	return isHydrated ? result : emptyResponse
}
