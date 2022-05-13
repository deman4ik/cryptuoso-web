import React from "react";
import {
    createStyles,
    Card,
    Text,
    Group,
    RingProgress,
    Skeleton,
    Badge,
    Tooltip,
    LoadingOverlay,
    ActionIcon
} from "@mantine/core";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "urql";
import { TextLink } from "@cryptuoso/components/Link/TextLink";
import { round } from "helpers";
import dayjs from "@cryptuoso/libs/dayjs";
import { Refresh } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));

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
        }
    }
`;

export function ExchangeAccountCard() {
    const { classes } = useStyles();

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
            }[];
        },
        { userId: string }
    >({ query: ExchangeAccountQuery, variables: { userId: session?.user?.userId } });
    const { data, fetching, error } = result;
    const myUserExAcc = data?.myUserExAcc[0];
    if (data) console.log(data);
    if (error) console.error(error);
    return (
        <Card shadow="sm" p="lg" className={classes.card}>
            <LoadingOverlay visible={fetching} />
            <Group position="apart" mb="md">
                <Text size="md" weight={900} transform="uppercase">
                    Exchange Account
                </Text>
                <ActionIcon variant="hover" onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}>
                    <Refresh size={18} />
                </ActionIcon>
            </Group>

            <Group position="apart">
                <Text size="md" weight={500} sx={{ lineHeight: 2 }}>
                    Exchange
                </Text>

                {myUserExAcc ? (
                    <Image src={`/${myUserExAcc?.exchange}.svg`} alt={myUserExAcc?.exchange} height={30} width={70} />
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>
            <Group position="apart" mt="md">
                <Text size="md" weight={500} sx={{ lineHeight: 2 }}>
                    API Key Status
                </Text>

                {myUserExAcc ? (
                    <Badge size="md" color={myUserExAcc?.status === "enabled" ? "green" : "red"}>
                        {myUserExAcc?.status}
                    </Badge>
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>

            <Group position="apart" mt="md">
                <Text size="md" weight={500} sx={{ lineHeight: 2 }}>
                    Current Balance
                </Text>

                {myUserExAcc ? (
                    <Tooltip label={`Updated ${dayjs.utc().to(myUserExAcc?.balanceUpdatedAt)}`}>
                        <Text size="md">{round(myUserExAcc?.balance, 2)} $</Text>
                    </Tooltip>
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>
        </Card>
    );
}
