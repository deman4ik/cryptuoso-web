import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { gql } from "urql";
import jwt from "jsonwebtoken";
import { UserAuthData } from "@cryptuoso/helpers";
import { gqlPublicClient } from "@cryptuoso/libs/graphql";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "email",
            name: "email",

            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                //   console.log("authorize", credentials);
                try {
                    const result = await gqlPublicClient
                        .mutation<{ result: { accessToken: string } }, { email: string; password: string }>(
                            gql`
                                mutation authLogin($email: String!, $password: String!) {
                                    result: authLogin(email: $email, password: $password) {
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

                    const accessToken = result?.data?.result.accessToken;
                    if (accessToken) {
                        const token = jwt.decode(accessToken) as jwt.JwtPayload;

                        return {
                            id: token.userId,
                            accessToken,

                            ...token
                        } as UserAuthData;
                    }
                    console.error("Failed to authorize.", result);
                    throw new Error("Failed to authorize. Please try again later.");
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            }
        }),
        CredentialsProvider({
            id: "accessToken",
            name: "accessToken",
            credentials: {
                accessToken: { label: "accessToken", type: "text" }
            },
            async authorize(credentials, req) {
                try {
                    const accessToken = credentials?.accessToken;
                    if (accessToken) {
                        const token = jwt.decode(accessToken) as jwt.JwtPayload;

                        return {
                            id: token.userId,
                            accessToken,

                            ...token
                        } as UserAuthData;
                    }
                    throw new Error("Failed to authorize. Please try again later.");
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            }
        }),
        CredentialsProvider({
            id: "telegram",
            name: "telegram",

            credentials: {
                data: { label: "Data", type: "text" }
            },
            async authorize(credentials, req) {
                try {
                    const result = await gqlPublicClient
                        .mutation<{ result: { accessToken: string } }, { data: any }>(
                            gql`
                                mutation authLoginTelegram($data: TelegramInput!) {
                                    result: authLoginTelegram(data: $data) {
                                        accessToken
                                    }
                                }
                            `,
                            {
                                data: JSON.parse(credentials?.data as string)
                            }
                        )
                        .toPromise();
                    //   console.log(result);
                    if (result.error) {
                        console.error("telegram auth", result.error);
                        throw result.error;
                    }

                    const accessToken = result?.data?.result.accessToken;

                    if (accessToken) {
                        const token = jwt.decode(accessToken) as jwt.JwtPayload;
                        //    console.log(token);
                        return {
                            id: token.userId,
                            accessToken,

                            ...token
                        } as UserAuthData;
                    }
                    console.error("Failed to authorize.", result);
                    throw new Error("Failed to authorize. Please try again later.");
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

            return { ...session, user: { ...session.user, ...(token.user as UserAuthData) } };
        },
        async jwt(params) {
            //  console.log("jwt callback", params);
            const { token, user } = params;

            if (user) {
                token.user = user;
            }

            // TODO: check for expiration and refresh access token if "remember me" is set
            //https://next-auth.js.org/tutorials/refresh-token-rotation
            /*
            const exp = token.exp as number;
            const userData = token.user as UserAuthData;

            if (exp && userData) {
                console.warn("token", dayjs.utc(exp * 1000).toISOString());
                console.warn("user", dayjs.utc(userData?.exp * 1000).toISOString());
                console.warn(
                    "if",
                    dayjs.utc(exp * 1000).toISOString(),
                    dayjs.utc().toISOString(),
                    exp * 1000 < dayjs.utc().valueOf()
                );
            }
            if (
                (userData?.exp && userData.exp * 1000 < dayjs.utc().valueOf()) ||
                (exp && exp * 1000 < dayjs.utc().valueOf())
            ) {
                const result = await gqlPublicClient
                    .mutation<{ result: { accessToken: string } }>(
                        gql`
                            mutation authRefreshToken {
                                result: authRefreshToken {
                                    accessToken
                                }
                            }
                        `
                    )
                    .toPromise();

                console.log("authRefreshToken", result);
                if (result.error) {
                    console.error(result.error);
                    return {
                        ...token,
                        error: "RefreshAccessTokenError"
                    };
                }

                const accessToken = result?.data?.result.accessToken;
                if (accessToken) {
                    const newToken = jwt.decode(accessToken) as jwt.JwtPayload;

                    return {
                        ...token,
                        user: {
                            id: token.userId,
                            accessToken: result?.data?.result.accessToken,

                            ...newToken
                        }
                    };
                }
            } */

            return token;
        }
    },
    session: {
        maxAge: 60 //60 * 60 * 24 * 6 // 6 days
    },
    jwt: {
        maxAge: 60 //60 * 60 * 24 * 6 // 6 days
    }
    // debug: true
};
export default NextAuth(authOptions);
