import { UserPositionsQuery } from "@cryptuoso/queries";
import { BasePosition } from "@cryptuoso/types";
import { Group, SegmentedControl } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "urql";
import { BaseCard, CardHeader, RefreshAction } from "../Card";
import { PositionsList } from "./PositionsList";

export function UserPortfolioPositions() {
    const [statusFilter, setStatusFilter] = useState("open");
    const { data: session } = useSession<true>({ required: true });
    const [result, reexecuteQuery] = useQuery<
        {
            userPortfolio: {
                openPositions: BasePosition[];
                closedPositions: BasePosition[];
            }[];
        },
        { userId: string }
    >({ query: UserPositionsQuery, variables: { userId: session?.user?.userId || "" } });
    const { data, fetching, error } = result;

    const openPositions = data?.userPortfolio[0]?.openPositions || [];
    const closedPositions = data?.userPortfolio[0]?.closedPositions || [];
    if (error) console.error(error);
    return (
        <BaseCard fetching={fetching} justify="flex-start">
            <CardHeader
                title={statusFilter === "open" ? "Open Trades" : "Closed Trades"}
                right={
                    <Group spacing="xs">
                        <SegmentedControl
                            size="sm"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            data={[
                                { label: "Open", value: "open" },
                                { label: "Closed", value: "closed" }
                            ]}
                        />

                        <RefreshAction reexecuteQuery={reexecuteQuery} />
                    </Group>
                }
            />

            <PositionsList positions={statusFilter === "open" ? openPositions : closedPositions} type={statusFilter} />
        </BaseCard>
    );
}
