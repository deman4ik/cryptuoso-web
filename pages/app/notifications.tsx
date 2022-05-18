import { Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";

export default function NotificationsPage() {
    return (
        <Layout title="Notifications">
            <Head>
                <title>Notifications | CRYPTUOSO</title>
            </Head>
            <Text>Notifications</Text>
        </Layout>
    );
}
