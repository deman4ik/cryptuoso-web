import { createClient } from "@urql/core";
import { useSession } from "next-auth/react";
import * as React from "react";

/**
 * Get GraphQL Client in browser environments (frontend).
 *
 * If the user has an active session, it will add an accessToken to all requests
 */
const useClient = (options?: RequestInit) => {
    const { data: session }: any = useSession();

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
            }
        });

        return client;
    }, [options, token]);
};

export default useClient;
