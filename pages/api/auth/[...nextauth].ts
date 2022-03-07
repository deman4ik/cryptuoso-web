import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getToken, JWT } from "next-auth/jwt";
import { createClient, gql } from "urql";
import jwt from "jsonwebtoken";

export const client = createClient({
    url: `${process.env.NEXT_PUBLIC_HASURA_URL}`
});

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: "email",

            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                //   console.log("authorize", credentials);
                try {
                    const result = await client
                        .mutation<{ result: { accessToken: string } }, { email: string; password: string }>(
                            gql`
                                mutation login($email: String!, $password: String!) {
                                    result: login(email: $email, password: $password) {
                                        accessToken
                                    }
                                }
                            `,
                            {
                                email: `${credentials?.email}`,
                                password: `${credentials?.password}`
                            }
                        )
                        .toPromise();

                    //  console.log(result);
                    if (result.error) {
                        throw result.error;
                    }
                    //TODO: get user from gql
                    return {
                        id: 1,
                        name: "deman4ik",
                        email: "deman4ik@gmail.com",
                        accessToken: result?.data?.result.accessToken
                    };
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/signin"
    },
    callbacks: {
        // async signIn(user, account, profile) { return true },
        // async redirect(url, baseUrl) { return baseUrl },
        async session(params) {
            // console.log("session callback", params);

            const { session, token } = params;

            return { ...session, user: { ...session.user, ...(token.user as { [key: string]: any }) } };
        },
        async jwt(params) {
            //    console.log("jwt callback", params);
            const { token, user } = params;
            // TODO: check for expiration and refresh access token
            //https://next-auth.js.org/tutorials/refresh-token-rotation

            if (user) {
                token.user = user;
            }
            return token;
        }
    }
    // debug: true
});
