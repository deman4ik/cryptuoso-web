import { round } from "@cryptuoso/helpers";
import { StatsInfo } from "@cryptuoso/types";
import { Grid } from "@mantine/core";
import { Coin, ListCheck, Minus, Plus, Scale } from "tabler-icons-react";
import { OperationContext } from "urql";
import { Equity } from "./Equity";
import { StatsCard } from "./StatsCard";

export function PortfolioSimpleStats({
    stats,
    fetching,
    reexecuteQuery
}: {
    stats?: StatsInfo;
    fetching: boolean;
    reexecuteQuery: (opts?: { requestPolicy?: OperationContext["requestPolicy"] }) => void;
}) {
    return (
        <Grid gutter="xs">
            <Grid.Col span={12}>
                <Equity fetching={fetching} reexecuteQuery={reexecuteQuery} equity={stats?.equity} />
            </Grid.Col>

            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={Coin}
                    title="Profit / Loss"
                    values={[
                        {
                            value: round(stats?.netProfit),
                            diff: round(stats?.percentNetProfit || 0),
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
                            value: round(stats?.tradesCount),
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
                            value: round(stats?.winRate),
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
                            value: round(stats?.maxDrawdown),
                            valueType: "$",
                            diff: -round(stats?.percentMaxDrawdown || 0),
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
                            value: stats?.payoffRatio || 0,
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
                            value: stats?.sharpeRatio || 0,
                            desc: "Return ratio compared to risk"
                        }
                    ]}
                />
            </Grid.Col>
        </Grid>
    );
}
