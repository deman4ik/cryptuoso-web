import { useState } from "react";
import { Option, PortfolioOptions, PortfolioSettings, StatsInfo, UserExAcc } from "@cryptuoso/types";
import { gql, useMutation, useQuery } from "urql";
import { Button, SimpleGrid, Stack, Text, useMantineTheme } from "@mantine/core";
import { OptionsPicker } from "../controls/OptionsPicker";
import { BaseCard, CardHeader } from "@cryptuoso/components/App/Card";
import { PortfolioSimpleStats } from "../PortfolioSimpleStats";
import { Briefcase, Plus } from "tabler-icons-react";
import { portfoliosQuery, ExchangeAccountQuery } from "@cryptuoso/queries";
import { useSession } from "next-auth/react";
import { useForm } from "@mantine/form";
import { TradingAmountFormControls } from "../controls/TradingAmountFormControls";
import { SimpleLink } from "@cryptuoso/components/Link";

export function CreateUserPortfolio({ onSuccess }: { onSuccess?: () => void }) {
    const { data: session } = useSession<true>({ required: true });
    const theme = useMantineTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    let [options, setOptions] = useState<Option[]>([Option.profit]);

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

    const [userExAccResult, reexecuteMyUserExAccQuery] = useQuery<
        {
            userExAcc: UserExAcc[];
        },
        { userId: string }
    >({ query: ExchangeAccountQuery, variables: { userId: session?.user?.userId || "" } });
    const { data: userExAccData, fetching: userExAccFetching, error: userExAccError } = userExAccResult;
    const userExAcc = userExAccData?.userExAcc[0];

    const [portfoliosResult, reexecutePortfoliosQuery] = useQuery<{
        portfolios: [
            {
                stats: StatsInfo;
            }
        ];
    }>({
        query: portfoliosQuery,
        variables: { exchange: userExAcc?.exchange, ...selectedOptions }
    });

    const { data: portfoliosData, fetching: portfoliosFetching, error: portfoliosError } = portfoliosResult;

    const portfolioStats = portfoliosData?.portfolios[0]?.stats;

    const form = useForm<{
        tradingAmountType: PortfolioSettings["tradingAmountType"];
        balancePercent: PortfolioSettings["balancePercent"];
        tradingAmountCurrency?: PortfolioSettings["tradingAmountCurrency"];
    }>({
        initialValues: {
            tradingAmountType: "balancePercent",
            balancePercent: 100,
            tradingAmountCurrency: userExAcc?.balance
        }

        /* validate: {
            tradingAmountType: (value) => !!value || "Invalid trading amount type",
            balancePercent: (value) => !!value || "Invalid percent value",
            tradingAmountCurrency: (value) => !!value || "Invalid amount"
        }*/
    });

    const [, userPortfolioCreate] = useMutation<
        { result: { result: string } },
        {
            exchange: string;
            userExAccId: string;
            tradingAmountType: string;
            balancePercent?: number;
            tradingAmountCurrency?: number;
            options: PortfolioOptions;
        }
    >(
        gql`
            mutation userPortfolioCreate(
                $exchange: String!
                $userExAccId: uuid
                $tradingAmountType: String!
                $balancePercent: Int
                $tradingAmountCurrency: Int
                $options: PortfolioOptions
            ) {
                result: userPortfolioCreate(
                    exchange: $exchange
                    userExAccId: $userExAccId
                    tradingAmountType: $tradingAmountType
                    balancePercent: $balancePercent
                    tradingAmountCurrency: $tradingAmountCurrency
                    options: $options
                ) {
                    result
                }
            }
        `
    );

    const handleSubscribe = async () => {
        setLoading(true);
        setError(null);

        const result = await userPortfolioCreate({
            exchange: userExAcc?.exchange || "",
            userExAccId: userExAcc?.id || "",
            tradingAmountType: form.values.tradingAmountType || "",
            balancePercent: form.values.balancePercent || 0,
            tradingAmountCurrency: form.values.tradingAmountCurrency || 0,
            options: selectedOptions
        });

        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result?.result) {
            if (onSuccess) {
                onSuccess();
            } else {
                setLoading(false);
            }
        }
    };
    return (
        <BaseCard fetching={userExAccFetching || portfoliosFetching || loading} justify="flex-start">
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "md", cols: 1 }]} spacing="xl">
                <Stack spacing={0}>
                    <CardHeader title="Choose Portfolio Options" />
                    <OptionsPicker options={options} setOptions={setOptions} />
                </Stack>
                <Stack spacing={0}>
                    <CardHeader title="Choose Trading Amount" />
                    <TradingAmountFormControls
                        form={form}
                        currentBalance={userExAcc?.balance}
                        currentBalanceUpdatedAt={userExAcc?.balanceUpdatedAt}
                    />
                </Stack>
            </SimpleGrid>

            {error && (
                <Text color="red" size="sm" mt="sm" weight={500}>
                    {error}
                </Text>
            )}
            <Button
                onClick={handleSubscribe}
                size="lg"
                variant="gradient"
                my="xl"
                gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                leftIcon={<Plus size={18} />}
                disabled={userExAccFetching || portfoliosFetching}
                loading={loading}
            >
                Subscribe
            </Button>
            <CardHeader
                title="Selected Portfolio Performance History"
                right={
                    <Button
                        component={SimpleLink}
                        href={
                            {
                                pathname: "/app/portfolios/[[...slug]]",
                                query: {
                                    exchange: userExAcc?.exchange,
                                    ...selectedOptions
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
                        Details
                    </Button>
                }
            />
            <PortfolioSimpleStats
                stats={portfolioStats}
                fetching={portfoliosFetching}
                reexecuteQuery={reexecutePortfoliosQuery}
            />
        </BaseCard>
    );
}
