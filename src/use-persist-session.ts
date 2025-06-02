import { useEffect } from "react"
import type { AnyAuthClient } from "@/types/any-auth-client"
import { subscribePersistSession } from "./subscribe-persist-session"

export function usePersistSession(authClient: AnyAuthClient) {
	useEffect(() => subscribePersistSession(authClient), [authClient])
}
