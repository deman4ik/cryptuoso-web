import { StatsInfo } from "@cryptuoso/types";
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

const useStyles = createStyles((theme, { heightMultiplier }: { heightMultiplier: number }) => ({
    chart: {
        height: theme.spacing.xl * heightMultiplier
    }
}));

export function Equity({
    equity,
    fetching,
    reexecuteQuery,
    heightMultiplier = 10
}: {
    equity?: StatsInfo["equity"];
    fetching: boolean;
    reexecuteQuery: (opts?: { requestPolicy?: OperationContext["requestPolicy"] }) => void;
    heightMultiplier?: number;
}) {
    const { classes } = useStyles({ heightMultiplier });

    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Equity"
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
