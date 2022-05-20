import round from "@cryptuoso/helpers/round";
import { Grid } from "@mantine/core";
import { useSession } from "next-auth/react";
import { Coin, ListCheck, Minus, Plus, Scale } from "tabler-icons-react";
import { gql, useQuery } from "urql";
import { StatsCard, PortfolioCard, UserPortfolio, Equity } from "@cryptuoso/components/App/Portfolio";

const PortfolioQuery = gql`
    query myPortfolio($userId: uuid!) {
        myPortfolio: v_user_portfolios(where: { user_id: { _eq: $userId } }) {
            id
            userExAccId: user_ex_acc_id
            exchange
            status
            message
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
                percentMaxDrawdown: percent_max_drawdown
                payoffRatio: payoff_ratio
                sharpeRatio: sharpe_ratio
                recoveryFactor: recovery_factor
                avgTradesCount: avg_trades_count_years
                avgPercentNetProfitYearly: avg_percent_net_profit_yearly
                equity: equity
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
    }
`;

export function PortfolioGrid() {
    const { data: session }: any = useSession();
    const [result, reexecuteQuery] = useQuery<
        {
            myPortfolio: UserPortfolio[];
        },
        { userId: string }
    >({ query: PortfolioQuery, variables: { userId: session?.user?.userId } });
    const { data, fetching, error } = result;
    const myPortfolio = data?.myPortfolio[0];
    if (data) console.log(data);
    if (error) console.error(error);
    return (
        <Grid>
            <Grid.Col span={12} md={4}>
                <StatsCard
                    Icon={Coin}
                    fetching={!myPortfolio}
                    title="Profit"
                    diff={round(myPortfolio?.stats.percentNetProfit || 0) || 0}
                    value={`${round(myPortfolio?.stats.netProfit || 0, 2)} $`}
                    desc="Portfolio Total Profit"
                />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
                <StatsCard
                    Icon={ListCheck}
                    title="Trades"
                    value={round(myPortfolio?.stats.tradesCount || 0) || 0}
                    desc="Total trades"
                />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
                <StatsCard
                    Icon={Plus}
                    title="Win Rate"
                    value={`${round(myPortfolio?.stats.winRate || 0)} %`}
                    desc="Trades win rate"
                />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
                <StatsCard
                    Icon={Minus}
                    title="Max Drawdown"
                    value={`${round(myPortfolio?.stats.maxDrawdown || 0)} $`}
                    diff={-(round(myPortfolio?.stats.percentMaxDrawdown || 0) || 0)}
                    desc="Maximum balance drawdown"
                />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
                <StatsCard
                    Icon={Scale}
                    title="Payoff Ratio"
                    value={myPortfolio?.stats.payoffRatio || 0}
                    desc="Ratio between wins and losses"
                />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
                <StatsCard
                    Icon={Scale}
                    title="Sharpe Ratio"
                    value={myPortfolio?.stats.sharpeRatio || 0}
                    desc="Return ratio compared to risk"
                />
            </Grid.Col>
            <Grid.Col span={12} sm={6}>
                <Equity fetching={fetching} reexecuteQuery={reexecuteQuery} equity={myPortfolio?.stats.equity} />
            </Grid.Col>
            <Grid.Col span={12} sm={6}>
                <PortfolioCard
                    fetching={fetching}
                    reexecuteQuery={reexecuteQuery}
                    status={myPortfolio?.status}
                    options={myPortfolio?.settings.options}
                    message={myPortfolio?.message}
                />
            </Grid.Col>
        </Grid>
    );
}
