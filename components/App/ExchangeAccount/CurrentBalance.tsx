import { BaseCard, CardHeader, RefreshAction } from "@cryptuoso/components/App/Card";
import { SimpleLink } from "@cryptuoso/components/Link";
import { round } from "@cryptuoso/helpers/number";
import dayjs from "@cryptuoso/libs/dayjs";
import { ExchangeAccountQuery } from "@cryptuoso/queries";
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

export function CurrentBalance() {
    const { classes } = useStyles();
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
                left={
                    userExAcc ? (
                        <Tooltip
                            transition="fade"
                            transitionDuration={500}
                            transitionTimingFunction="ease"
                            placement="start"
                            label={userExAcc?.status === "enabled" ? "Checked" : userExAcc?.error}
                            color={userExAcc?.status === "enabled" ? "green" : "red"}
                        >
                            <Badge color={userExAcc?.status === "enabled" ? "green" : "red"} size="sm">
                                {userExAcc?.status}
                            </Badge>
                        </Tooltip>
                    ) : (
                        <Skeleton height={18} circle />
                    )
                }
                right={
                    <Group spacing={0}>
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
                    {userExAcc ? (
                        <Tooltip
                            transition="fade"
                            transitionDuration={500}
                            transitionTimingFunction="ease"
                            placement="start"
                            label={`Updated ${dayjs.utc().to(dayjs.utc(userExAcc?.balanceUpdatedAt))}`}
                        >
                            <Text className={classes.value} weight={500}>{`${round(
                                userExAcc?.balance || 0,
                                2
                            )} $`}</Text>
                        </Tooltip>
                    ) : (
                        <Skeleton height={8} width="30%" />
                    )}

                    {userExAcc ? (
                        <Text size="sm" color="dimmed" weight={500}>
                            Current Balance
                        </Text>
                    ) : (
                        <Skeleton height={8} width="30%" />
                    )}
                </Stack>

                {userExAcc ? (
                    <Image
                        src={`/${userExAcc?.exchange}.svg`}
                        alt={userExAcc?.exchange}
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