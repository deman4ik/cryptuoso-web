import { createStyles, Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";

const useStyles = createStyles((theme) => ({
    darkBg: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white
    }
}));
export default function DashboardPage() {
    const { classes } = useStyles();

    return (
        <Layout title="Dashboard">
            <Head>
                <title>Dashboard | CRYPTUOSO</title>
            </Head>
            <Text>Hello App!</Text>
        </Layout>
    );
}