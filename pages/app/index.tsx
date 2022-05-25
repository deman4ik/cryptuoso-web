import { createStyles, Grid } from "@mantine/core";
import Head from "next/head";
import { gql, useQuery } from "urql";
import { useSession } from "next-auth/react";
import { Layout } from "@cryptuoso/components/App/Layout";
import { Portfolio, PortfolioStats, Section } from "@cryptuoso/components/App/Dashboard";
import { CurrentBalance, Billing } from "@cryptuoso/components/App/Dashboard";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

const useStyles = createStyles((theme) => ({
    darkBg: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white
    }
}));

const DashboardQuery = gql`
    query allUserInfo($userId: uuid!) {
        myPortfolio: v_user_portfolios(where: { user_id: { _eq: $userId } }) {
            id
            userExAccId: user_ex_acc_id
            exchange
            status
            startedAt: started_at
            stoppedAt: stopped_at
            activeFrom: active_from
            settings: user_portfolio_settings
            nextSettings: next_user_portfolio_settings
            stats {
                tradesCount: trades_count
                currentBalance: current_balance
                netProfit: net_profit
                percentNetProfit: percent_net_profit
                winRate: win_rate
                maxDrawdown: max_drawdown
                maxDrawdownDate: max_drawdown_date
                payoffRatio: payoff_ratio
                sharpeRatio: sharpe_ratio
                recoveyFactor: recovery_factor
                avgTradesCount: avg_trades_count_years
                avgPercentNetProfitYearly: avg_percent_net_profit_yearly
                equityAvg: equity_avg
                firstPosition: first_position
                lastPosition: last_position
            }
        }
        openPosSum: v_user_positions_aggregate(where: { user_id: { _eq: $userId }, status: { _eq: "open" } }) {
            aggregate {
                sum {
                    unrealizedProfit: profit
                }
                openTradesCount: count
            }
        }
        myUser: users(where: { id: { _eq: $userId } }) {
            id
            email
            name
            telegramId: telegram_id
            telegramUsername: telegram_username
            roles
            access
            status
            settings
        }
        myUserExAcc: v_user_exchange_accs(
            where: { user_id: { _eq: $userId } }
            limit: 1
            order_by: { created_at: desc }
        ) {
            id
            exchange
            name
            status
            balance: total_balance_usd
        }
        myUserSub: user_subs(
            where: { user_id: { _eq: $userId }, status: { _nin: ["canceled", "expired"] } }
            order_by: { created_at: desc_nulls_last }
            limit: 1
        ) {
            id
            user_id
            status
            trial_started
            trial_ended
            active_from
            active_to
            subscription {
                id
                name
                description
            }
            subscriptionOption {
                code
                name
            }
            userPayments: user_payments(order_by: { created_at: desc_nulls_last }, limit: 1) {
                id
                code
                url
                status
                price
                created_at
                expires_at
                subscription_from
                subscription_to
            }
        }
    }
`;
export default function DashboardPage() {
    const { classes } = useStyles();
    const { data: session }: any = useSession();
    const [result] = useQuery({ query: DashboardQuery, variables: { userId: session?.user?.userId } });
    const { data, fetching, error } = result;
    if (data) console.log(data);
    if (error) console.error(error);
    return (
        <Layout title="Dashboard">
            <Head>
                <title>Dashboard | CRYPTUOSO</title>
            </Head>
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
        </Layout>
    );
}
