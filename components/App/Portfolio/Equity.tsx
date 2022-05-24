import { StatsInfo } from "@cryptuoso/components/Stats";
import { ActionIcon, createStyles, Skeleton } from "@mantine/core";
import { Refresh } from "tabler-icons-react";
import { OperationContext } from "urql";
import { BaseCard, CardHeader } from "@cryptuoso/components/App/Card";
import { Time } from "lightweight-charts";
import dynamic from "next/dynamic";
import dayjs from "@cryptuoso/libs/dayjs";
import { formatAreaChartData } from "@cryptuoso/components/Chart/helpers";
const AreaChart = dynamic(() => import("@cryptuoso/components/Chart/AreaChart"), {
    ssr: false
});

const useStyles = createStyles((theme) => ({
    chart: {
        height: theme.spacing.xl * 10
    }
}));

export function Equity({
    equity,
    fetching,
    reexecuteQuery
}: {
    equity?: StatsInfo["equity"];
    fetching: boolean;
    reexecuteQuery: (opts?: { requestPolicy?: OperationContext["requestPolicy"] }) => void;
}) {
    const { classes } = useStyles();

    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="My Portfolio Equity"
                right={
                    <ActionIcon
                        color="gray"
                        variant="hover"
                        onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}
                    >
                        <Refresh size={18} />
                    </ActionIcon>
                }
            />
            <AreaChart data={formatAreaChartData(equity)} className={classes.chart} />
        </BaseCard>
    );
}
