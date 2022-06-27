import { Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";
import { NotificationsList } from "@cryptuoso/components/App/Notifications/NotificationsList";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

export default function NotificationsPage() {
    return (
        <Layout>
            <Head>
                <title>Notifications | CRYPTUOSO</title>
            </Head>
            <NotificationsList />
        </Layout>
    );
}
