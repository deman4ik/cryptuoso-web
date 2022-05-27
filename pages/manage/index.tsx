import { Grid, Text } from "@mantine/core";
import Head from "next/head";
import { Layout, FiltersContext } from "@cryptuoso/components/Manage/Layout";
import { UsersSection } from "@cryptuoso/components/Manage/Monitoring/Users";
import { useContext } from "react";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

export default function MonitoringPage() {
    return (
        <Layout>
            <Head>
                <title>Monitoring | CRYPTUOSO</title>
            </Head>
            <Grid gutter="xs">
                <Grid.Col span={12}>
                    <UsersSection />
                </Grid.Col>
            </Grid>
        </Layout>
    );
}
