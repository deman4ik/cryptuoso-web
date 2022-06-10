import React, { useState } from "react";
import { Group, Badge, Text, Button, Modal } from "@mantine/core";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "urql";
import { round } from "helpers";
import dayjs from "@cryptuoso/libs/dayjs";
import { Key, Refresh } from "tabler-icons-react";
import { BaseCard, CardHeader, CardLine, RefreshAction } from "@cryptuoso/components/App/Card";
import { ExchangeAccountForm } from "./ExchangeAccountForm";

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
    const [modalOpened, setModalOpened] = useState(false);
    const { data: session } = useSession<true>({ required: true });
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
    >({ query: ExchangeAccountQuery, variables: { userId: session?.user?.userId || "" } });
    const { data, fetching, error } = result;
    const myUserExAcc = data?.myUserExAcc[0];

    if (error) console.error(error);
    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Exchange Account"
                right={
                    <Group spacing={0}>
                        {myUserExAcc?.id && (
                            <Button
                                color="gray"
                                variant="subtle"
                                compact
                                uppercase
                                rightIcon={<Key size={18} />}
                                onClick={() => setModalOpened(true)}
                            >
                                Edit
                            </Button>
                        )}
                        <RefreshAction reexecuteQuery={reexecuteQuery} />
                    </Group>
                }
            />

            {!fetching && !myUserExAcc ? (
                <Button
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                    uppercase
                    rightIcon={<Key size={18} />}
                    onClick={() => setModalOpened(true)}
                >
                    Create
                </Button>
            ) : (
                <>
                    <CardLine
                        mt={0}
                        title="Exchange"
                        loading={fetching}
                        value={
                            <Image
                                src={`/${myUserExAcc?.exchange}.svg`}
                                alt={myUserExAcc?.exchange}
                                height={30}
                                width={70}
                            />
                        }
                    />
                    <CardLine
                        title="API Key Status"
                        loading={fetching}
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
                        loading={fetching}
                        value={`${round(myUserExAcc?.balance || 0, 2)} $`}
                        valueTooltip={`Updated ${dayjs.utc().to(dayjs.utc(myUserExAcc?.balanceUpdatedAt))}`}
                    />
                </>
            )}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={
                    <Text transform="uppercase" weight={900} align="center">
                        {myUserExAcc?.id ? "Edit Exchange Account" : "Create Exchange Account"}
                    </Text>
                }
            >
                <ExchangeAccountForm
                    id={myUserExAcc?.id}
                    exchange={myUserExAcc?.exchange}
                    onSuccess={() => {
                        reexecuteQuery({ requestPolicy: "network-only" });
                        setModalOpened(false);
                    }}
                />
            </Modal>
        </BaseCard>
    );
}
