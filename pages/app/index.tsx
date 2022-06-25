import { Button, Container, Grid, Skeleton } from "@mantine/core";
import Head from "next/head";
import { gql, useQuery } from "urql";
import { useSession } from "next-auth/react";
import { Layout } from "@cryptuoso/components/App/Layout";
import { Section } from "@cryptuoso/components/App/Trading";
import { GettingStarted } from "@cryptuoso/components/App/Trading/GettingStarted";
import { CurrentBalance } from "@cryptuoso/components/App/ExchangeAccount";
import { Billing } from "@cryptuoso/components/App/Subscription";
import { PortfolioStats, UserPortfolio } from "@cryptuoso/components/App/Portfolio";
import { UserPortfolioPositions } from "@cryptuoso/components/App/Portfolio/UserPortfolioPositions";
import { SimpleLink } from "@cryptuoso/components/Link";
import { Briefcase } from "tabler-icons-react";
import { Url, UrlObject } from "url";
import { LinkProps } from "next/link";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

const TradingQuery = gql`
    query TradingInfo($userId: uuid!) {
        portfolioExists: v_user_portfolios(where: { user_id: { _eq: $userId } }) {
            id
            settings: user_portfolio_settings
        }
        userExAcExists: user_exchange_accs(
            where: { user_id: { _eq: $userId } }
            limit: 1
            order_by: { created_at: desc }
        ) {
            id
            exchange
        }
        userSubExists: user_subs(
            where: { user_id: { _eq: $userId } }
            order_by: { created_at: desc_nulls_last }
            limit: 1
        ) {
            id
            status
            userPayments: user_payments(
                where: { status: { _in: ["COMPLETED", "RESOLVED"] } }
                order_by: { created_at: desc_nulls_last }
                limit: 1
            ) {
                id
            }
        }
    }
`;
export default function TradingPage() {
    const { data: session } = useSession<true>({ required: true });
    const [result, reexecuteQuery] = useQuery({ query: TradingQuery, variables: { userId: session?.user?.userId } });

    const { data, fetching, error } = result;

    if (error) console.error(error);
    let userExAccExists = data?.userExAcExists[0];
    let userSubExists = data?.userSubExists[0];
    let userSubActive = data?.userSubExists[0]?.status === "active";
    let userPaymentExists = data?.userSubExists[0]?.userPayments[0];
    let portfolioExists = data?.portfolioExists[0];
    const inited = userExAccExists && userSubExists && portfolioExists;
    return (
        <Layout>
            <Head>
                <title>Trading | CRYPTUOSO</title>
            </Head>
            {fetching ? (
                <>
                    <Grid gutter="xs">
                        <Grid.Col span={12} lg={6} xl={4}>
                            <Skeleton height={50} />
                        </Grid.Col>
                        <Grid.Col span={12} lg={6} xl={4}>
                            <Skeleton height={50} />
                        </Grid.Col>
                        <Grid.Col span={12} xl={4}>
                            <Skeleton height={50} />
                        </Grid.Col>
                    </Grid>
                    <Skeleton height={150} />
                    <Skeleton height={150} />
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
                            <UserPortfolio />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Section
                                title="Portfolio Perfomance"
                                right={
                                    <Button
                                        component={SimpleLink}
                                        href={
                                            {
                                                pathname: "/app/portfolios/[[...slug]]",
                                                query: {
                                                    exchange: userExAccExists?.exchange,
                                                    ...portfolioExists?.settings?.options
                                                }
                                            } as any //TODO: correct type?
                                        }
                                        target="_blank"
                                        color="gray"
                                        variant="subtle"
                                        compact
                                        uppercase
                                        rightIcon={<Briefcase size={18} />}
                                        styles={(theme) => ({
                                            rightIcon: {
                                                marginLeft: 5
                                            }
                                        })}
                                    >
                                        Public Performance
                                    </Button>
                                }
                            >
                                <PortfolioStats />
                            </Section>
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Section title="Portfolio Positions">
                                <UserPortfolioPositions />
                            </Section>
                        </Grid.Col>
                    </Grid>
                </>
            ) : (
                <GettingStarted
                    userExAccExists={userExAccExists}
                    userSubExists={userSubExists}
                    userSubActive={userSubActive}
                    userPaymentExists={userPaymentExists}
                    portfolioExists={portfolioExists}
                    refetch={() => reexecuteQuery({ requestPolicy: "network-only" })}
                />
            )}
        </Layout>
    );
}
