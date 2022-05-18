import React from "react";
import { Group, Badge, ActionIcon, Button } from "@mantine/core";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "urql";
import { round } from "helpers";
import dayjs from "@cryptuoso/libs/dayjs";
import { Key, Refresh } from "tabler-icons-react";
import { BaseCard, CardHeader, CardLine } from "@cryptuoso/components/App/Card";

const ExchangeAccountQuery = gql`
    query ExchangeAccount($userId: uuid!) {
        myUserExAcc: user_exchange_accs(
            where: { user_id: { _eq: $userId } }
            limit: 1
            order_by: { created_at: desc }
        ) {
            id
            exchange
            status
            balance: balances(path: "$.totalUSD")
            balanceUpdatedAt: balances(path: "$.updatedAt")
            error
        }
    }
`;

export function ExchangeAccountCard() {
    const { data: session }: any = useSession();
    const [result, reexecuteQuery] = useQuery<
        {
            myUserExAcc: {
                id: string;
                exchange: string;
                name: string;
                status: string;
                balance: number;
                balanceUpdatedAt: string;
                error?: string;
            }[];
        },
        { userId: string }
    >({ query: ExchangeAccountQuery, variables: { userId: session?.user?.userId } });
    const { data, fetching, error } = result;
    const myUserExAcc = data?.myUserExAcc[0];
    if (data) console.log(data);
    if (error) console.error(error);
    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Exchange Account"
                rightActions={
                    <Group spacing="xs">
                        <Button color="gray" variant="subtle" compact uppercase rightIcon={<Key size={18} />}>
                            Edit
                        </Button>
                        <ActionIcon
                            color="gray"
                            variant="hover"
                            onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}
                        >
                            <Refresh size={18} />
                        </ActionIcon>
                    </Group>
                }
            />

            <CardLine
                title="Exchange"
                loading={!myUserExAcc}
                value={
                    <Image src={`/${myUserExAcc?.exchange}.svg`} alt={myUserExAcc?.exchange} height={30} width={70} />
                }
            />
            <CardLine
                title="API Key Status"
                loading={!myUserExAcc}
                value={
                    <Badge size="md" color={myUserExAcc?.status === "enabled" ? "green" : "red"}>
                        {myUserExAcc?.status}
                    </Badge>
                }
                valueTooltip={myUserExAcc?.status === "enabled" ? "Checked" : myUserExAcc?.error}
                valueTooltipColor={myUserExAcc?.status === "enabled" ? "green" : "red"}
            />

            <CardLine
                title="Current Balance"
                loading={!myUserExAcc}
                value={`${round(myUserExAcc?.balance || 0, 2)} $`}
                valueTooltip={`Updated ${dayjs.utc().to(myUserExAcc?.balanceUpdatedAt)}`}
            />
        </BaseCard>
    );
}
