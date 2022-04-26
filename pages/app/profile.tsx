import { createStyles, LoadingOverlay, Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";
import { gql, useQuery } from "urql";
import { useSession } from "next-auth/react";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
    darkBg: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white
    }
}));

const UserQuery = gql`
    query UserProfile($userId: uuid!) {
        myUser: users(where: { id: { _eq: $userId } }) {
            id
            email
            name
            telegramId: telegram_id
            telegramUsername: telegram_username
            roles
            access
            status
            settings
        }
    }
`;

interface User {
    id: string;
    email: string;
    name: string;
    telegramId: string;
    telegramUsername: string;
    roles: { defaultRole: string; allowedRoles: string[] };
    access: number;
    status: number;
    settings: {
        notifications: {
            news: {
                email: boolean;
                telegram: boolean;
            };
            trading: {
                email: boolean;
                telegram: boolean;
            };
            signals: {
                email: boolean;
                telegram: boolean;
            };
        };
    };
}

export default function DashboardPage() {
    const { classes } = useStyles();

    const { data: session }: any = useSession();

    const [result, reexecuteQuery] = useQuery<
        {
            myUser: User[];
        },
        { userId: string }
    >({
        query: UserQuery,
        variables: {
            userId: session?.user?.userId
        }
    });

    const { data, fetching, error } = result;
    let myUser;
    if (data && data.myUser && Array.isArray(data.myUser) && data.myUser.length) myUser = data.myUser[0];
    if (error) console.error(error);
    return (
        <Layout title="Profile">
            <Head>
                <title>Profile | CRYPTUOSO</title>
            </Head>
            <LoadingOverlay visible={fetching} />
            <Text>Profile</Text>
            {data && <Text>{myUser?.name}</Text>}
            {error && <Text color="red">{error?.message}</Text>}
        </Layout>
    );
}
