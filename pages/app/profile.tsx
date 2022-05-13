import { createStyles, Grid, LoadingOverlay, Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";
import { gql, useQuery } from "urql";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ExchangeAccountCard } from "@cryptuoso/components/App/ExchangeAccount/ExchangeAccountCard";
import { ProfileCard } from "@cryptuoso/components/App/Profile/ProfileCard";

const useStyles = createStyles((theme) => ({
    darkBg: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white
    }
}));

export default function DashboardPage() {
    const { classes } = useStyles();

    return (
        <Layout title="Profile">
            <Head>
                <title>Profile | CRYPTUOSO</title>
            </Head>

            <Grid>
                <Grid.Col sm={12} md={4}>
                    <ProfileCard />
                </Grid.Col>
                <Grid.Col sm={12} md={4}>
                    <ExchangeAccountCard />
                </Grid.Col>
            </Grid>
        </Layout>
    );
}
