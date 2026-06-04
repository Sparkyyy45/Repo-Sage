import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }

  interface User {
    login?: string;
    avatarUrl?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    login?: string;
    avatarUrl?: string;
    accessToken?: string;
  }
}
