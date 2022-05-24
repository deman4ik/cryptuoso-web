import { BaseCard, CardHeader, RefreshAction } from "@cryptuoso/components/App/Card";
import { SimpleLink } from "@cryptuoso/components/Link";
import { round } from "@cryptuoso/helpers/number";
import dayjs from "@cryptuoso/libs/dayjs";
import { ActionIcon, createStyles, Group, Skeleton, Stack, Text, Tooltip, Badge, Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Key, Refresh } from "tabler-icons-react";
import { gql, useQuery } from "urql";

const useStyles = createStyles((theme) => ({
    value: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1
    },
    image: {
        transform: "rotate(-10deg)"
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
            error
        }
    }
`;

export function CurrentBalance() {
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
                error?: string;
            }[];
        },
        { userId: string }
    >({ query: ExchangeAccountQuery, variables: { userId: session?.user?.userId } });
    const { data, fetching, error } = result;
    const myUserExAcc = data?.myUserExAcc[0];

    if (error) console.error(error);

    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Exchange Account"
                left={
                    myUserExAcc ? (
                        <Tooltip
                            transition="fade"
                            transitionDuration={500}
                            transitionTimingFunction="ease"
                            placement="start"
                            label={myUserExAcc?.status === "enabled" ? "Checked" : myUserExAcc?.error}
                            color={myUserExAcc?.status === "enabled" ? "green" : "red"}
                        >
                            <Badge color={myUserExAcc?.status === "enabled" ? "green" : "red"} size="sm">
                                {myUserExAcc?.status}
                            </Badge>
                        </Tooltip>
                    ) : (
                        <Skeleton height={18} circle />
                    )
                }
                right={
                    <Group spacing="xs">
                        <Button
                            component={SimpleLink}
                            href="/app/exchange-account"
                            color="gray"
                            variant="subtle"
                            compact
                            uppercase
                            rightIcon={<Key size={18} />}
                        >
                            DETAILS
                        </Button>
                        <RefreshAction reexecuteQuery={reexecuteQuery} />
                    </Group>
                }
            />
            <Group position="apart">
                <Stack spacing="xs" mt={25}>
                    {myUserExAcc ? (
                        <Tooltip
                            transition="fade"
                            transitionDuration={500}
                            transitionTimingFunction="ease"
                            placement="start"
                            label={`Updated ${dayjs.utc().to(myUserExAcc?.balanceUpdatedAt)}`}
                        >
                            <Text className={classes.value}>{`${round(myUserExAcc?.balance || 0, 2)} $`}</Text>
                        </Tooltip>
                    ) : (
                        <Skeleton height={8} width="30%" />
                    )}

                    {myUserExAcc ? (
                        <Text size="sm" color="dimmed">
                            Current Balance
                        </Text>
                    ) : (
                        <Skeleton height={8} width="30%" />
                    )}
                </Stack>

                {myUserExAcc ? (
                    <Image
                        src={`/${myUserExAcc?.exchange}.svg`}
                        alt={myUserExAcc?.exchange}
                        className={classes.image}
                        height={80}
                        width={200}
                    />
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>
        </BaseCard>
    );
}
