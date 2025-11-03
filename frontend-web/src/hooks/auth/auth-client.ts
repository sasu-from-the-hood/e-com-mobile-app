import { createAuthClient } from "better-auth/react"
import { phoneNumberClient, adminClient } from "better-auth/client/plugins"
import { URL } from "../../config"

export const authClient = createAuthClient({
  baseURL: URL.BETTER_AUTH,
  plugins: [phoneNumberClient(), adminClient()]
})

export const { 
  signIn, 
  signUp, 
  phoneNumber,
  signOut, 
  useSession,
} = authClient