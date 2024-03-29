import { ExchangeAccountQuery, portfoliosQuery } from "@cryptuoso/queries";
import { PortfolioOptions, PortfolioSettings, UserPortfolio, Option, StatsInfo, UserExAcc } from "@cryptuoso/types";
import { Button, Group, LoadingOverlay, Stack, useMantineTheme, Text, ThemeIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { gql, useMutation, useQuery } from "urql";
import { BaseCard, CardHeader } from "@cryptuoso/components/App/Card";
import { OptionsPicker, TradingAmountFormControls } from "../controls";
import { PortfolioSimpleStats } from "../PortfolioSimpleStats";
import { equals } from "@cryptuoso/helpers";
import { Briefcase, Check } from "tabler-icons-react";
import { SimpleLink } from "@cryptuoso/components/Link";

export function ChangeOptionsForm({
    onSuccess,
    onCancel,
    userPortfolio
}: {
    onSuccess: () => void;
    onCancel: () => void;
    userPortfolio?: UserPortfolio;
}) {
    const { data: session } = useSession<true>({ required: true });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const portfolioOptionsArray = Object.entries(userPortfolio?.settings.options || {})
        .filter(([key, value]) => value)
        .map(([key]) => key as Option);
    let [options, setOptions] = useState<Option[]>(portfolioOptionsArray || [Option.profit]);

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
    const [userExAccResult] = useQuery<
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

    const subscribed = equals(userPortfolio?.settings.options, selectedOptions);

    const [, userPortfolioEditOptions] = useMutation<
        { result: { result: string } },
        {
            userPortfolioId: string;
            options: PortfolioOptions;
        }
    >(
        gql`
            mutation userPortfolioEditOptions($userPortfolioId: uuid!, $options: PortfolioOptions!) {
                result: userPortfolioEdit(userPortfolioId: $userPortfolioId, options: $options) {
                    result
                }
            }
        `
    );

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const result = await userPortfolioEditOptions({
            userPortfolioId: userPortfolio?.id || "",
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
        <div>
            <CardHeader title="Choose Portfolio Options" />
            <OptionsPicker options={options} setOptions={setOptions} />
            {(userExAccError?.message || portfoliosError?.message || error) && (
                <Text color="red" size="sm" mt="sm" weight={500}>
                    {userExAccError?.message || portfoliosError?.message || error}
                </Text>
            )}
            <Group position="center" my="xl" grow>
                <Button fullWidth size="lg" variant="subtle" color="gray" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    fullWidth
                    size="lg"
                    variant="gradient"
                    disabled={subscribed}
                    loading={loading}
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                    onClick={handleSubmit}
                >
                    Confirm
                </Button>
            </Group>
            <CardHeader
                title="Selected Portfolio Performance History"
                right={
                    <Group spacing={0} position="right" align="flex-start">
                        {subscribed && (
                            <Group spacing={5} position="right" align="flex-start">
                                <ThemeIcon color="green" size="sm">
                                    <Check />
                                </ThemeIcon>
                                <Text color="green" weight={500}>
                                    You are subscribed to this portfolio
                                </Text>
                            </Group>
                        )}
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
                    </Group>
                }
            />
            <PortfolioSimpleStats
                stats={portfolioStats}
                fetching={portfoliosFetching}
                reexecuteQuery={reexecutePortfoliosQuery}
            />
        </div>
    );
}
