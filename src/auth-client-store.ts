import { atom } from "nanostores"
import type { AnyAuthClient } from "./types/any-auth-client"

export const $authClient = atom<AnyAuthClient | null>(null)
