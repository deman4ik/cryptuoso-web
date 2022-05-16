import { createStyles, Grid, Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";
import { ExchangeAccountCard } from "@cryptuoso/components/App/ExchangeAccount/ExchangeAccountCard";

const useStyles = createStyles((theme) => ({
    darkBg: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white
    }
}));
export default function DashboardPage() {
    const { classes } = useStyles();

    return (
        <Layout title="Exchange Account">
            <Head>
                <title>Exchange Account | CRYPTUOSO</title>
            </Head>
            <Grid>
                <Grid.Col sm={12} md={4}>
                    <ExchangeAccountCard />
                </Grid.Col>
            </Grid>
        </Layout>
    );
}
