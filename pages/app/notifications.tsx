import { Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

export default function NotificationsPage() {
    return (
        <Layout>
            <Head>
                <title>Notifications | CRYPTUOSO</title>
            </Head>
            <Text>Notifications</Text>
        </Layout>
    );
}
