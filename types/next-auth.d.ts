import "@auth/core/types";
import "@auth/core/jwt";

declare module "@auth/core/types" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      login?: string;
      avatarUrl?: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    login?: string;
    avatarUrl?: string;
    accessToken?: string;
  }
}
