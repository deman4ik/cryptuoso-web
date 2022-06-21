import { round } from "@cryptuoso/helpers/number";
import dayjs from "@cryptuoso/libs/dayjs";
import { PortfolioSettings } from "@cryptuoso/types";
import { createStyles, NumberInput, Select, Group, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form/lib/use-form";
import { CurrencyDollar, Percentage } from "tabler-icons-react";
import { CardLine } from "@cryptuoso/components/App/Card";

const useStyles = createStyles((theme) => ({
    label: {
        color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6]
    }
}));

export function TradingAmountFormControls({
    form,
    currentBalance,
    currentBalanceUpdatedAt
}: {
    form: UseFormReturnType<{
        tradingAmountType: PortfolioSettings["tradingAmountType"];
        balancePercent: PortfolioSettings["balancePercent"];
        tradingAmountCurrency?: PortfolioSettings["tradingAmountCurrency"];
    }>;
    currentBalance?: number;
    currentBalanceUpdatedAt?: string;
}) {
    const { classes } = useStyles();
    return (
        <form>
            <Group align="center" grow>
                <Select
                    classNames={classes}
                    data={[
                        { label: "Percent of Balance", value: "balancePercent" },
                        { label: "Fixed amount in USD", value: "currencyFixed" }
                    ]}
                    required
                    placeholder="Trading amount type"
                    label="Trading amount type"
                    {...form.getInputProps("tradingAmountType")}
                />

                {form.values.tradingAmountType === "balancePercent" ? (
                    <NumberInput
                        classNames={classes}
                        placeholder="Amount in %"
                        label="Amount in %"
                        required
                        hideControls
                        precision={0}
                        max={100}
                        min={1}
                        {...form.getInputProps("balancePercent")}
                    />
                ) : (
                    <NumberInput
                        classNames={classes}
                        placeholder="Amount in USD"
                        label="Amount in USD"
                        required
                        hideControls
                        max={undefined}
                        min={1}
                        {...form.getInputProps("tradingAmountCurrency")}
                    />
                )}
            </Group>
            <CardLine
                mt={0}
                title="Current Exchange Balance"
                loading={!currentBalance}
                value={`${round(currentBalance || 0, 2)} $`}
                valueTooltip={`Updated ${dayjs.utc().to(dayjs.utc(currentBalanceUpdatedAt))}`}
                titleProps={{ weight: 500 }}
                valueProps={{ color: "dimmed", weight: 600 }}
                position="right"
                containerProps={{ spacing: "xs" }}
            />
        </form>
    );
}
//TODO: min and max value validation
