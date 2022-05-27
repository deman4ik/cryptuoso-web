import { ActionIcon } from "@mantine/core";
import { Refresh } from "tabler-icons-react";
import { OperationContext } from "urql";

export function RefreshAction({
    reexecuteQuery
}: {
    reexecuteQuery: (opts?: { requestPolicy?: OperationContext["requestPolicy"] }) => void;
}) {
    return (
        <ActionIcon color="gray" variant="hover" onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}>
            <Refresh size={18} />
        </ActionIcon>
    );
}
