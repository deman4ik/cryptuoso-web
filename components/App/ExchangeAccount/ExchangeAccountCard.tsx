import React, { useState } from "react";
import { Group, Badge, Text, Button, Modal, useMantineTheme } from "@mantine/core";
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
        userExAcc: user_exchange_accs(where: { user_id: { _eq: $userId } }, limit: 1, order_by: { created_at: desc }) {
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
    const theme = useMantineTheme();
    const [modalOpened, setModalOpened] = useState(false);
    const { data: session } = useSession<true>({ required: true });
    const [result, reexecuteQuery] = useQuery<
        {
            userExAcc: {
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
    const userExAcc = data?.userExAcc[0];

    if (error) console.error(error);
    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Exchange Account"
                right={
                    <Group spacing={0} position="right" align="flex-start">
                        {userExAcc?.id && (
                            <Button
                                color="gray"
                                variant="subtle"
                                compact
                                uppercase
                                rightIcon={<Key size={18} />}
                                onClick={() => setModalOpened(true)}
                                styles={(theme) => ({
                                    rightIcon: {
                                        marginLeft: 5
                                    }
                                })}
                            >
                                Edit
                            </Button>
                        )}
                        <RefreshAction reexecuteQuery={reexecuteQuery} />
                    </Group>
                }
            />

            {!fetching && !userExAcc ? (
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
                                src={`/${userExAcc?.exchange}.svg`}
                                alt={userExAcc?.exchange}
                                height={30}
                                width={70}
                            />
                        }
                    />
                    <CardLine
                        title="API Key Status"
                        loading={fetching}
                        value={
                            <Badge
                                size="md"
                                variant="gradient"
                                gradient={{
                                    from: userExAcc?.status === "enabled" ? "lime" : "orange",
                                    to: userExAcc?.status === "enabled" ? "green" : "red"
                                }}
                            >
                                {userExAcc?.status}
                            </Badge>
                        }
                        valueTooltip={userExAcc?.status === "enabled" ? "Checked" : userExAcc?.error}
                        valueTooltipColor={userExAcc?.status === "enabled" ? "green" : "red"}
                    />

                    <CardLine
                        title="Current Balance"
                        loading={fetching}
                        value={
                            <Text
                                variant="gradient"
                                gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                weight={700}
                                size="md"
                            >
                                ${round(userExAcc?.balance || 0, 2)}
                            </Text>
                        }
                        valueTooltip={`Updated ${dayjs.utc().to(dayjs.utc(userExAcc?.balanceUpdatedAt))}`}
                    />
                </>
            )}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={
                    <Text transform="uppercase" weight={900} align="center">
                        {userExAcc?.id ? "Edit Exchange Account" : "Create Exchange Account"}
                    </Text>
                }
            >
                <ExchangeAccountForm
                    id={userExAcc?.id}
                    exchange={userExAcc?.exchange}
                    onSuccess={() => {
                        reexecuteQuery({ requestPolicy: "network-only" });
                        setModalOpened(false);
                    }}
                />
            </Modal>
        </BaseCard>
    );
}
