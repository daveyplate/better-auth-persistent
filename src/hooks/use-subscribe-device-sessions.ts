import { useEffect } from "react"
import { subscribeDeviceSessions } from "../subscribe-device-sessions"

export function useSubscribeDeviceSessions() {
    useEffect(() => {
        return subscribeDeviceSessions()
    }, [])
}
