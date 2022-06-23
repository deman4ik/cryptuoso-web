import { round } from "@cryptuoso/helpers";
import dayjs from "@cryptuoso/libs/dayjs";
import { StatsInfo } from "@cryptuoso/types";
import { Grid } from "@mantine/core";
import {
    Bolt,
    CalendarStats,
    Cash,
    CashBanknote,
    Coin,
    ListCheck,
    Minus,
    Plus,
    PresentationAnalytics,
    Scale,
    Trophy
} from "tabler-icons-react";
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
                <Equity
                    fetching={fetching}
                    reexecuteQuery={reexecuteQuery}
                    equity={stats?.equity}
                    heightMultiplier={10}
                />
            </Grid.Col>

            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={CashBanknote}
                    title="Starting Balance"
                    values={[
                        {
                            value: round(stats?.initialBalance || 0),
                            valueType: "$",
                            desc: "Initial portfolio balance"
                        }
                    ]}
                />
            </Grid.Col>
            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={Cash}
                    title="Current Balance"
                    values={[
                        {
                            value: round(stats?.currentBalance || 0),
                            valueType: "$",
                            desc: "Current portfolio balance"
                        }
                    ]}
                />
            </Grid.Col>
            <Grid.Col span={12} sm={6} lg={4}>
                <StatsCard
                    fetching={fetching}
                    Icon={CalendarStats}
                    title="First trade"
                    values={[
                        {
                            value: dayjs.utc().to(dayjs.utc(stats?.firstPosition.entryDate)),
                            valueType: null,
                            desc: "Portfolio started"
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
                    Icon={Trophy}
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
                    Icon={Bolt}
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
                    Icon={PresentationAnalytics}
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
