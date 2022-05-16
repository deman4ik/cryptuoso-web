import { createStyles, Grid, Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";
import { SubscriptionCard } from "@cryptuoso/components/App/Subscription/SubscriptionCard";
import { PaymentHistory } from "@cryptuoso/components/App/Subscription/PaymentHistory";

const useStyles = createStyles((theme) => ({
    darkBg: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white
    }
}));
export default function DashboardPage() {
    const { classes } = useStyles();

    return (
        <Layout title="Billing">
            <Head>
                <title>Billing | CRYPTUOSO</title>
            </Head>
            <Grid>
                <Grid.Col sm={12} md={6}>
                    <SubscriptionCard />
                </Grid.Col>
                <Grid.Col span={12}>
                    <PaymentHistory />
                </Grid.Col>
            </Grid>
        </Layout>
    );
}
