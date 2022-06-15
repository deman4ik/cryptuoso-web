import { useState } from "react";
import { FullStats, Option, PortfolioOptions, StatsInfo } from "@cryptuoso/types";
import { gql, useQuery } from "urql";
import { Button, Container, Group, SimpleGrid, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core";
import { OptionsPicker } from "./OptionsPicker";
import { BaseCard, CardHeader } from "@cryptuoso/components/App/Card";
import { PortfolioSimpleStats } from "./PortfolioSimpleStats";
import { Plus } from "tabler-icons-react";
import { getPortfolioOptionsIcons } from "@cryptuoso/helpers/portfolio";
import Image from "next/image";

const portfoliosQuery = gql`
    query PublicPortfolios(
        $exchange: String!
        $risk: Boolean!
        $profit: Boolean!
        $winRate: Boolean!
        $efficiency: Boolean!
        $moneyManagement: Boolean!
    ) {
        portfolios: v_portfolios(
            where: {
                exchange: { _eq: $exchange }
                option_risk: { _eq: $risk }
                option_profit: { _eq: $profit }
                option_win_rate: { _eq: $winRate }
                option_efficiency: { _eq: $efficiency }
                option_money_management: { _eq: $moneyManagement }
                status: { _eq: "started" }
                base: { _eq: true }
            }
            limit: 1
        ) {
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
    }
`;

export function ChoosePortfolio() {
    const theme = useMantineTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const exchange = "binance_futures";
    let [options, setOptions] = useState<Option[]>([Option.profit]);
    if (!options.length) options = [Option.profit];
    const selectedOptions: PortfolioOptions = {
        profit: false,
        risk: false,
        moneyManagement: false,
        winRate: false,
        efficiency: false
    };

    for (const option of options) {
        selectedOptions[option] = true;
    }

    const optionRows = getPortfolioOptionsIcons(selectedOptions, "value");
    const [result, reexecuteQuery] = useQuery<{
        portfolios: [
            {
                stats: StatsInfo;
            }
        ];
    }>({
        query: portfoliosQuery,
        variables: { exchange, ...selectedOptions }
    });
    //TODO: get exchange from userExAcc
    const { data, fetching, error: queryError } = result;

    const portfolioStats = data?.portfolios[0]?.stats;

    const handleSubscribe = async () => {};
    return (
        <BaseCard fetching={fetching || loading} justify="flex-start">
            <CardHeader title="Choose Portfolio Options" />
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "md", cols: 1 }]} spacing="xl">
                <OptionsPicker options={options} setOptions={setOptions} />
                <Stack>
                    <Group position="center">
                        <Image src={`/${exchange}.svg`} alt={exchange} height={40} width={100} />
                        {optionRows}
                    </Group>
                    <Button
                        onClick={handleSubscribe}
                        size="md"
                        variant="gradient"
                        gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                        px="xl"
                        leftIcon={<Plus size={18} />}
                    >
                        Subscribe
                    </Button>
                </Stack>
            </SimpleGrid>

            <PortfolioSimpleStats
                stats={portfolioStats}
                fetching={fetching || loading}
                reexecuteQuery={reexecuteQuery}
            />
        </BaseCard>
    );
}
