// Auth client setup for React Native with phone number plugin
import { URL } from '@/config';
import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { phoneNumberClient } from "better-auth/client/plugins"
// import { expoPasskeyClient } from "expo-better-auth-passkey"

const plugin = [
        expoClient({
            scheme: "ecom",
            storagePrefix: "ecom",
            storage: SecureStore,
        }),
        phoneNumberClient(),
        // expoPasskeyClient(),
]

// Create the base client
export const baseClient = createAuthClient({
  baseURL: URL.BETTER_AUTH,
  plugins : plugin,
});


// betterauth client with phone number sign-in 
export const authClient = baseClient as typeof baseClient & {
  signIn: typeof baseClient.signIn & {
    phoneNumber: (data: {
      phoneNumber: string;
      password: string;
      rememberMe?: boolean;
    }) => Promise<any>;
  };
  phoneNumber: {
    sendOtp: (data: { phoneNumber: string }) => Promise<any>;
    verify: (data: {
      phoneNumber: string;
      code: string;
      disableSession?: boolean;
      updatePhoneNumber?: boolean;
    }) => Promise<any>;
    requestPasswordReset: (data: { phoneNumber: string }) => Promise<any>;
    resetPassword: (data: {
      otp: string;
      phoneNumber: string;
      newPassword: string;
    }) => Promise<any>;
  };
  passkey: {
    addPasskey: (data: { name?: string }) => Promise<any>;
    listUserPasskeys: () => Promise<any>;
    deletePasskey: (data: { id: string }) => Promise<any>;
  };
};

export type AuthClient = typeof authClient;





