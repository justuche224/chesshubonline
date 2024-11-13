import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "./data/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {},
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }
      const existingUser = await getUserById(user.id);

      if (!existingUser || !existingUser?.emailVerified) {
        return false;
      }
      return true;
    },
    async session({ token, session }) {
      // console.log(session);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (token.username && session.user) {
        session.user.username = token.username;
      }

      if (session.user) {
        session.user.image = token.image;
      }
      // console.log(session.user);
      return session;
    },
    async jwt({ token }) {
      // console.log(token);
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      // console.log(existingUser);
      token.image = existingUser.image;
      token.role = existingUser.role;
      token.username = existingUser.username;

      return token;
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});

//debug: process.env.NODE_ENV === "development",
