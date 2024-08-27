import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      //   credentials: {
      //     email: {
      //       label: "Emaild",
      //       type: "text",
      //       placeholder: "your-email@example.com",
      //     },
      //     password: { label: "Password", type: "password" },
      //   },
      authorize: async (credentials) => {
        const isTruthy = (val: any) =>
          ((val !== undefined && val !== null) ||
            val === true ||
            val === "true") &&
          val !== false &&
          val !== "false";

        console.log("authorize", credentials);
        if (isTruthy(credentials?.suc)) {
          const user = { id: 1, name: "Test User", credentials };
          return user;
        }
        throw new Error("[...nextauth].js authorize failed");
      },
    }),
  ],
  pages: {
    signIn: "/signin", // Custom sign-in page
  },
  session: {
    jwt: true, // Use JWT for sessions
  },
  callbacks: {
    async signIn(params) {
      console.log("signIn", params);
      return true;
    },
    async jwt({ token, user }) {
      console.log("JWT", { token, user });
      // If the user object is available, add it to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("session", { session, token });
      // Add the user ID from the token to the session object
      session.user.id = token.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);
