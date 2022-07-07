import { ExchangeAccountQuery } from "@cryptuoso/queries";
import { PortfolioSettings, UserExAcc, UserPortfolio } from "@cryptuoso/types";
import { Button, Group, LoadingOverlay, Stack, useMantineTheme, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { gql, useMutation, useQuery } from "urql";
import { BaseCard, CardHeader } from "@cryptuoso/components/App/Card";
import { TradingAmountFormControls } from "../controls";

export function ChangeTradingAmountForm({
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
    const [userExAccResult] = useQuery<
        {
            userExAcc: UserExAcc[];
        },
        { userId: string }
    >({ query: ExchangeAccountQuery, variables: { userId: session?.user?.userId || "" } });
    const { data: userExAccData, fetching: userExAccFetching, error: userExAccError } = userExAccResult;
    const userExAcc = userExAccData?.userExAcc[0];

    const form = useForm<{
        tradingAmountType: PortfolioSettings["tradingAmountType"];
        balancePercent: PortfolioSettings["balancePercent"];
        tradingAmountCurrency?: PortfolioSettings["tradingAmountCurrency"];
    }>({
        initialValues: {
            tradingAmountType: userPortfolio?.settings.tradingAmountType,
            balancePercent: userPortfolio?.settings.balancePercent || 100,
            tradingAmountCurrency: userPortfolio?.settings.tradingAmountCurrency || userExAcc?.balance
        }

        /* validate: {
            tradingAmountType: (value) => !!value || "Invalid trading amount type",
            balancePercent: (value) => !!value || "Invalid percent value",
            tradingAmountCurrency: (value) => !!value || "Invalid amount"
        }*/
    });

    const [, userPortfolioEditAmount] = useMutation<
        { result: { result: string } },
        {
            userPortfolioId: string;
            tradingAmountType: string;
            balancePercent?: number;
            tradingAmountCurrency?: number;
        }
    >(
        gql`
            mutation userPortfolioEditAmount(
                $userPortfolioId: uuid!
                $tradingAmountType: String!
                $balancePercent: Int
                $tradingAmountCurrency: Int
            ) {
                result: userPortfolioEdit(
                    userPortfolioId: $userPortfolioId
                    tradingAmountType: $tradingAmountType
                    balancePercent: $balancePercent
                    tradingAmountCurrency: $tradingAmountCurrency
                ) {
                    result
                }
            }
        `
    );

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const result = await userPortfolioEditAmount({
            userPortfolioId: userPortfolio?.id || "",
            tradingAmountType: form.values.tradingAmountType || "",
            balancePercent: form.values.balancePercent || 0,
            tradingAmountCurrency: form.values.tradingAmountCurrency || 0
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
            <CardHeader title="Choose Trading Amount" />
            <TradingAmountFormControls
                form={form}
                currentBalance={userExAcc?.balance}
                currentBalanceUpdatedAt={userExAcc?.balanceUpdatedAt}
            />
            {(userExAccError?.message || error) && (
                <Text color="red" size="sm" mt="sm" weight={500}>
                    {userExAccError?.message || error}
                </Text>
            )}
            <Group position="center" mt="xl" grow>
                <Button fullWidth size="lg" variant="subtle" color="gray" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    fullWidth
                    size="lg"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                    onClick={handleSubmit}
                    loading={loading}
                >
                    Confirm
                </Button>
            </Group>
        </div>
    );
}
