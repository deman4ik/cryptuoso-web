import { cacheExchange, createClient, dedupExchange, fetchExchange } from "@urql/core";
import { requestPolicyExchange } from "@urql/exchange-request-policy";
import { refocusExchange } from "@urql/exchange-refocus";
import { errorExchange } from "urql";
import { signIn, useSession } from "next-auth/react";
import * as React from "react";

/**
 * Get GraphQL Client in browser environments (frontend).
 *
 * If the user has an active session, it will add an accessToken to all requests
 */
const useClient = (options?: RequestInit) => {
    const { data: session } = useSession();

    const token = session?.user?.accessToken;
    // const handleError = useErrorHandler();

    return React.useMemo(() => {
        const client = createClient({
            url: `${process.env.NEXT_PUBLIC_HASURA_URL}`,
            fetchOptions: () => {
                if (token)
                    return {
                        headers: {
                            authorization: `Bearer ${token}`,
                            ...options?.headers
                        }
                    };
                else
                    return {
                        headers: { ...(options?.headers ? options.headers : {}) }
                    };
            },
            exchanges: [
                dedupExchange,
                refocusExchange(),
                requestPolicyExchange({
                    ttl: 5 * 60 * 1000
                }),
                cacheExchange,
                errorExchange({
                    onError: (error) => {
                        // we only get an auth error here when the auth exchange had attempted to refresh auth and getting an auth error again for the second time
                        const isAuthError = error.graphQLErrors.some(
                            (e) => e.extensions?.code === "FORBIDDEN" || e.message.includes("JWTExpired")
                        );

                        if (isAuthError) {
                            signIn(); //TODO: disable redirects? or just log out?
                            // clear storage, log the user out etc
                        }
                    }
                }),
                fetchExchange
            ]
        });

        return client;
    }, [options, token]);
};

export default useClient;

export const gqlPublicClient = createClient({
    url: `${process.env.NEXT_PUBLIC_HASURA_URL}`
});
