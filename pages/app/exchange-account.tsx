import { createStyles, Grid } from "@mantine/core";
import Head from "next/head";
import { Layout } from "@cryptuoso/components/App/Layout";
import { ExchangeAccountCard } from "@cryptuoso/components/App/ExchangeAccount";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

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
                <Grid.Col span={12} sm={6}>
                    <ExchangeAccountCard />
                </Grid.Col>
            </Grid>
        </Layout>
    );
}
