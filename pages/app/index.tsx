import { createStyles, Grid, Skeleton } from "@mantine/core";
import Head from "next/head";
import { gql, useQuery } from "urql";
import { useSession } from "next-auth/react";
import { Layout } from "@cryptuoso/components/App/Layout";
import { Portfolio, PortfolioStats, Section } from "@cryptuoso/components/App/Dashboard";
import { CurrentBalance, Billing } from "@cryptuoso/components/App/Dashboard";
import { GettingStarted } from "@cryptuoso/components/App/Dashboard/GettingStarted";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

const DashboardQuery = gql`
    query DashboardInfo($userId: uuid!) {
        portfolioExists: user_portfolios(where: { user_id: { _eq: $userId } }) {
            id
        }
        userExAcExists: user_exchange_accs(
            where: { user_id: { _eq: $userId } }
            limit: 1
            order_by: { created_at: desc }
        ) {
            id
        }
        userSubExists: user_subs(
            where: { user_id: { _eq: $userId } }
            order_by: { created_at: desc_nulls_last }
            limit: 1
        ) {
            id
        }
    }
`;
export default function DashboardPage() {
    const { data: session } = useSession<true>({ required: true });
    const [result, reexecuteQuery] = useQuery({ query: DashboardQuery, variables: { userId: session?.user?.userId } });

    const { data, fetching, error } = result;
    if (data) console.log(data);
    if (error) console.error(error);
    let userExAcExists = data?.userExAcExists[0];
    let userSubExists = data?.userSubExists[0];
    let portfolioExists = data?.portfolioExists[0];
    const inited = userExAcExists && userSubExists && portfolioExists;
    return (
        <Layout>
            <Head>
                <title>Dashboard | CRYPTUOSO</title>
            </Head>
            {fetching ? (
                <>
                    <Grid gutter="xs">
                        <Grid.Col span={12} lg={6} xl={4}>
                            <Skeleton />
                        </Grid.Col>
                        <Grid.Col span={12} lg={6} xl={4}>
                            <Skeleton />
                        </Grid.Col>
                        <Grid.Col span={12} xl={4}>
                            <Skeleton />
                        </Grid.Col>
                    </Grid>
                    <Skeleton />
                </>
            ) : inited ? (
                <>
                    <Grid gutter="xs">
                        <Grid.Col span={12} lg={6} xl={4}>
                            <CurrentBalance />
                        </Grid.Col>
                        <Grid.Col span={12} lg={6} xl={4}>
                            <Billing />
                        </Grid.Col>
                        <Grid.Col span={12} xl={4}>
                            <Portfolio />
                        </Grid.Col>
                    </Grid>
                    <Section title="Portfolio Perfomance">
                        <PortfolioStats />
                    </Section>
                </>
            ) : (
                <GettingStarted />
            )}
        </Layout>
    );
}
