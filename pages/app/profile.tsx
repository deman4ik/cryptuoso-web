import { Grid } from "@mantine/core";
import Head from "next/head";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import { ProfileCard } from "@cryptuoso/components/App/Profile/ProfileCard";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

export default function ProfilePage() {
    return (
        <Layout>
            <Head>
                <title>Profile | CRYPTUOSO</title>
            </Head>

            <Grid>
                <Grid.Col sm={12} md={4}>
                    <ProfileCard />
                </Grid.Col>
            </Grid>
        </Layout>
    );
}
