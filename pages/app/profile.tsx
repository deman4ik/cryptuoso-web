import { createStyles, LoadingOverlay, Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";
import { gql, useQuery } from "urql";
import { useSession } from "next-auth/react";

const useStyles = createStyles((theme) => ({
    darkBg: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white
    }
}));

const UserQuery = gql`
    query UserProfile($userId: uuid!) {
        users(where: { id: { _eq: $userId } }) {
            name
        }
    }
`;

export default function DashboardPage() {
    const { classes } = useStyles();

    const { data: session }: any = useSession();

    const [result, reexecuteQuery] = useQuery<{ users: [{ name: string }] }, { userId: string }>({
        query: UserQuery,
        variables: {
            userId: session?.user?.userId
        }
    });

    const { data, fetching, error } = result;
    if (error) console.error(error);
    return (
        <Layout title="Profile">
            <Head>
                <title>Profile | CRYPTUOSO</title>
            </Head>
            <LoadingOverlay visible={fetching} />
            <Text>Profile</Text>
            {data && <Text>{data.users[0].name}</Text>}
            {error && <Text color="red">{error?.message}</Text>}
        </Layout>
    );
}
