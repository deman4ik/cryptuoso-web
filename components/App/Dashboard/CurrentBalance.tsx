import { BaseCard, CardHeader } from "@cryptuoso/components/App/Card";
import { round } from "@cryptuoso/helpers/number";
import dayjs from "@cryptuoso/libs/dayjs";
import { ActionIcon, createStyles, Group, Skeleton, Stack, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import { Refresh } from "tabler-icons-react";
import { gql, useQuery } from "urql";

const useStyles = createStyles((theme) => ({
    value: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1
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

    if (data) console.log(data);
    if (error) console.error(error);

    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Exchange Account"
                rightActions={
                    <ActionIcon
                        color="gray"
                        variant="hover"
                        onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}
                    >
                        <Refresh size={18} />
                    </ActionIcon>
                }
            />
            <Stack>
                <Group align="flex-end" spacing="xs" mt={25}>
                    {myUserExAcc ? (
                        <Text className={classes.value}>{`${round(myUserExAcc?.balance || 0, 2)} $`}</Text>
                    ) : (
                        <Skeleton height={8} width="30%" />
                    )}
                </Group>

                {myUserExAcc ? (
                    <Text size="sm" color="dimmed" mt={7}>
                        {`Updated ${dayjs.utc().to(myUserExAcc?.balanceUpdatedAt)}`}
                    </Text>
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Stack>
        </BaseCard>
    );
}
