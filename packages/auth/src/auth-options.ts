import { type DefaultSession, type NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginService } from "../../api/src/service/common-services";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  type UserRole = "Manager" | "Parent" | "PortalAdmin" | "Teacher";

  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
    } & DefaultSession["user"];
  }

  //
  // interface User extends DefaultUser {
  //   id: string;
  //   role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return Promise.resolve(token);
    },
    session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      //  session.user.role = "abc"
      session.user = token.user as User;
      return session;
    }
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@gmail.com"
        },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, _) {
        // Add logic here to look up the user from the credentials supplied
        if (credentials) {
          // Any object returned will be saved in `user` property of the JWT
          return loginService
            .loginUser(credentials.email, credentials.password)
            .then((resp) => {
              if (resp && resp.userId)
                return {
                  id: resp.userId
                };
              else {
                throw new Error("User does not exist");
              }
            })
            .catch((_) => null);
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ]
};
