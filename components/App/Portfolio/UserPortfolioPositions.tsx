import { round } from "@cryptuoso/helpers";
import { UserPositionsQuery } from "@cryptuoso/queries";
import { BasePosition } from "@cryptuoso/types";
import { Center, Group, Pagination, SegmentedControl } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "urql";
import { BaseCard, CardHeader, RefreshAction } from "../Card";
import { PositionsList } from "./PositionsList";

const ITEMS_LIMIT = 12;

export function UserPortfolioPositions() {
    const [statusFilter, setStatusFilter] = useState("open");
    const { data: session } = useSession<true>({ required: true });
    const [page, setPage] = useState(1);

    const [result, reexecuteQuery] = useQuery<
        {
            userPortfolio: {
                openPositions: BasePosition[];
                closedPositionsCount: {
                    aggregate: {
                        count: number;
                    };
                };
                closedPositions: BasePosition[];
            }[];
        },
        { userId: string; offset: number; limit: number }
    >({
        query: UserPositionsQuery,
        variables: { userId: session?.user?.userId || "", offset: (page - 1) * ITEMS_LIMIT, limit: ITEMS_LIMIT }
    });
    const { data, fetching, error } = result;

    const openPositions = data?.userPortfolio[0]?.openPositions || [];
    const closedPositions = data?.userPortfolio[0]?.closedPositions || [];
    const closedPositionsCount = data?.userPortfolio[0]?.closedPositionsCount?.aggregate?.count || 0;
    if (error) console.error(error);
    return (
        <BaseCard fetching={fetching} justify="flex-start">
            <CardHeader
                title={statusFilter === "open" ? "Open Trades" : "Closed Trades"}
                right={
                    <Group spacing={0} position="right" align="center">
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
            {statusFilter === "closed" && closedPositionsCount > ITEMS_LIMIT && (
                <Center>
                    <Pagination
                        mt="xs"
                        page={page}
                        onChange={setPage}
                        total={round(closedPositionsCount / ITEMS_LIMIT)}
                    />
                </Center>
            )}
        </BaseCard>
    );
}
