import { Container, Grid } from "@mantine/core";
import Head from "next/head";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import { ProfileCard } from "@cryptuoso/components/App/Profile/ProfileCard";
import { ExchangeAccountCard } from "@cryptuoso/components/App/ExchangeAccount";
import { PaymentHistory, SubscriptionCard } from "@cryptuoso/components/App/Subscription";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

export default function AccountsPage() {
    return (
        <Layout>
            <Head>
                <title>Accounts | CRYPTUOSO</title>
            </Head>

            <Grid grow gutter="xs">
                <Grid.Col sm={12} md={6}>
                    <ProfileCard />
                </Grid.Col>
                <Grid.Col span={12} md={6}>
                    <ExchangeAccountCard />
                </Grid.Col>
                <Grid.Col span={12}>
                    <SubscriptionCard />
                </Grid.Col>

                <Grid.Col span={12}>
                    <PaymentHistory />
                </Grid.Col>
            </Grid>
        </Layout>
    );
}
