import { refetchOptions } from "@cryptuoso/libs/graphql";
import { ActionIcon } from "@mantine/core";
import { Refresh } from "tabler-icons-react";
import { OperationContext } from "urql";

export function RefreshAction({
    reexecuteQuery
}: {
    reexecuteQuery: (opts?: { requestPolicy?: OperationContext["requestPolicy"] }) => void;
}) {
    return (
        <ActionIcon color="gray" variant="subtle" onClick={() => reexecuteQuery(refetchOptions)}>
            <Refresh size={18} />
        </ActionIcon>
    );
}
