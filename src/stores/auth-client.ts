import { atom } from "nanostores"
import type { AuthClient } from "../types/auth-client"

export const $authClient = atom<AuthClient | null>(null)
