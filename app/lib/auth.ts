import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        user_name: { label: "User Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.user_name || !credentials?.password) {
          return null;
        }

        try {
          const baseUrl =
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000"
              : "https://www.miniteach.org";

          console.log("Auth baseUrl:", baseUrl);

          const response = await fetch(`${baseUrl}/api/companion/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_name: credentials.user_name,
              password: credentials.password,
            }),
          });

          const result = await response.json();
          console.log("Auth response:", response.status, result);

          if (result.success && result.companion) {
            return {
              id: result.companion.id.toString(),
              email: result.companion.user_name,
              name: `${result.companion.first_name} ${result.companion.last_name}`,
              token: result.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.companionId = user.id;
        token.accessToken = (user as { token?: string }).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.companionId as string;
      }
      (session as { accessToken?: string }).accessToken =
        token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/companion/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}
