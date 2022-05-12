import React from "react";
import { createStyles, Card, Text, Group, RingProgress, Skeleton } from "@mantine/core";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "urql";

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));

const ExchangeAccountQuery = gql`
    query ExchangeAccount($userId: uuid!) {
        myUserExAcc: v_user_exchange_accs(
            where: { user_id: { _eq: $userId } }
            limit: 1
            order_by: { created_at: desc }
        ) {
            id
            exchange
            name
            status
            balance: total_balance_usd
        }
    }
`;

export function ExchangeAccountCard() {
    const { classes } = useStyles();

    const { data: session }: any = useSession();
    const [result] = useQuery<{
        myUserExAcc: {
            id: string;
            exchange: string;
            name: string;
            status: string;
            balance: number;
        }[];
    }>({ query: ExchangeAccountQuery, variables: { userId: session?.user?.userId } });
    const { data, fetching, error } = result;
    const myUserExAcc = data?.myUserExAcc[0];
    if (data) console.log(data);
    if (error) console.error(error);
    return (
        <Card withBorder p="lg" className={classes.card}>
            <Group position="apart">
                <Text size="md" weight={700}>
                    Exchange
                </Text>

                {myUserExAcc ? (
                    <Image src={`/${myUserExAcc?.exchange}.svg`} alt={myUserExAcc?.exchange} height={32} width={70} />
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>
            <Group position="apart" mt="md">
                <Text size="md" weight={700}>
                    API Key Status
                </Text>

                {myUserExAcc ? (
                    <Text size="sm" color={myUserExAcc?.status === "enabled" ? "green" : "red"} transform="capitalize">
                        {myUserExAcc?.status}
                    </Text>
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>

            <Group position="apart" mt="md">
                <Text size="md" weight={700}>
                    Current Balance
                </Text>

                {myUserExAcc ? (
                    <Text size="sm" color="dimmed">
                        {myUserExAcc?.balance} $
                    </Text>
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>
        </Card>
    );
}
