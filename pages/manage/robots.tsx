import { Center, Grid, Stack, Text, ThemeIcon } from "@mantine/core";
import Head from "next/head";
import { Layout } from "@cryptuoso/components/Manage/Layout";
import { Bulldozer } from "tabler-icons-react";

export default function RobotsPage() {
    return (
        <Layout>
            <Head>
                <title>Robots | CRYPTUOSO</title>
            </Head>

            <Stack align="center" mt={100}>
                <Bulldozer size={64} />

                <Text size="xl" weight={900}>
                    UNDER CONSTRUCTION
                </Text>
            </Stack>
        </Layout>
    );
}
