import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "YOUR_WEB_CLIENT_ID",
  offlineAccess: true,
});

export const getAccessToken = async (): Promise<string | null> => {
  try {
    // Check if user already signed in
    const currentUser = GoogleSignin.getCurrentUser();

    // Sign in only if needed
    if (!currentUser) {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
    }

    // Reuse existing session tokens
    const tokens = await GoogleSignin.getTokens();

    return tokens.accessToken;

  } catch (error) {
    console.log("Token Error:", error);
    return null;
  }
};