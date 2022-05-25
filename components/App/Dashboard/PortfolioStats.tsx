import round from "@cryptuoso/helpers/round";
import { Grid } from "@mantine/core";
import { useSession } from "next-auth/react";
import { Coin, ListCheck, Minus, Plus, Scale } from "tabler-icons-react";
import { gql, useQuery } from "urql";
import { StatsCard, UserPortfolio, Equity } from "@cryptuoso/components/App/Portfolio";

const PortfolioQuery = gql`
    query myPortfolioStats($userId: uuid!) {
        myPortfolioStats: v_user_portfolios(where: { user_id: { _eq: $userId } }) {
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

export function PortfolioStats() {
    const { data: session }: any = useSession();
    const [result, reexecuteQuery] = useQuery<
        {
            myPortfolioStats: { stats: UserPortfolio["stats"] }[];
            openPosSum: {
                aggregate: {
                    sum: {
                        unrealizedProfit?: number;
                    };
                };
                openTradesCount: number;
            };
        },
        { userId: string }
    >({ query: PortfolioQuery, variables: { userId: session?.user?.userId } });
    const { data, fetching, error } = result;
    const myPortfolioStats = data?.myPortfolioStats[0];

    if (data) console.log(data);
    if (error) console.error(error);
    return (
        <Grid gutter="xs">
            <Grid.Col span={12}>
                <Equity fetching={fetching} reexecuteQuery={reexecuteQuery} equity={myPortfolioStats?.stats.equity} />
            </Grid.Col>
            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={Coin}
                    title="Unrealized Profit / Loss"
                    values={[
                        {
                            value: round(data?.openPosSum.aggregate.sum.unrealizedProfit, 2),
                            valueType: "$",
                            changeValueColor: true,
                            plusValue: true,
                            desc: "Potential Profit / Loss of open positions"
                        }
                    ]}
                />
            </Grid.Col>
            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={ListCheck}
                    title="Open Trades"
                    values={[
                        {
                            value: round(data?.openPosSum.openTradesCount),
                            desc: "Open positions amount"
                        }
                    ]}
                />
            </Grid.Col>
            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={Coin}
                    title="Profit / Loss"
                    values={[
                        {
                            value: round(myPortfolioStats?.stats.netProfit, 2),
                            diff: round(myPortfolioStats?.stats.percentNetProfit || 0),
                            valueType: "$",
                            changeValueColor: true,
                            plusValue: true,
                            desc: "Total Profit / Loss of closed positions"
                        }
                    ]}
                />
            </Grid.Col>

            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={ListCheck}
                    title="Trades"
                    values={[
                        {
                            value: round(myPortfolioStats?.stats.tradesCount),
                            desc: "Closed positions amount"
                        }
                    ]}
                />
            </Grid.Col>
            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={Plus}
                    title="Win Rate"
                    values={[
                        {
                            value: round(myPortfolioStats?.stats.winRate),
                            valueType: "%",
                            desc: "Trades win rate"
                        }
                    ]}
                />
            </Grid.Col>
            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={Minus}
                    title="Max Drawdown"
                    values={[
                        {
                            value: round(myPortfolioStats?.stats.maxDrawdown),
                            valueType: "$",
                            diff: -round(myPortfolioStats?.stats.percentMaxDrawdown || 0),
                            desc: "Maximum balance drawdown"
                        }
                    ]}
                />
            </Grid.Col>
            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={Scale}
                    title="Payoff Ratio"
                    values={[
                        {
                            value: myPortfolioStats?.stats.payoffRatio || 0,
                            desc: "Ratio between wins and losses"
                        }
                    ]}
                />
            </Grid.Col>
            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={Scale}
                    title="Sharpe Ratio"
                    values={[
                        {
                            value: myPortfolioStats?.stats.sharpeRatio || 0,
                            desc: "Return ratio compared to risk"
                        }
                    ]}
                />
            </Grid.Col>
        </Grid>
    );
}
