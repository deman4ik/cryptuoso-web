import { StatsInfo } from "@cryptuoso/components/Stats";
import { ActionIcon, Skeleton } from "@mantine/core";
import { Refresh } from "tabler-icons-react";
import { OperationContext } from "urql";
import { BaseCard, CardHeader } from "@cryptuoso/components/App/Card";

export function Equity({
    equity,
    fetching,
    reexecuteQuery
}: {
    equity?: StatsInfo["equity"];
    fetching: boolean;
    reexecuteQuery: (opts?: { requestPolicy?: OperationContext["requestPolicy"] }) => void;
}) {
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
            <Skeleton height={200} />
        </BaseCard>
    );
}
