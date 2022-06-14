import { createStyles, Grid, Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout";
import Head from "next/head";
import { SubscriptionCard, PaymentHistory } from "@cryptuoso/components/App/Subscription";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

const useStyles = createStyles((theme) => ({
    darkBg: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white
    }
}));
export default function DashboardPage() {
    const { classes } = useStyles();

    return (
        <Layout>
            <Head>
                <title>Billing | CRYPTUOSO</title>
            </Head>
            <Grid>
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
