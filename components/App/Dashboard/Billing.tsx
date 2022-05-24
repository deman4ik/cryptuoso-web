import { BaseCard, CardHeader, RefreshAction } from "@cryptuoso/components/App/Card";
import { Logo } from "@cryptuoso/components/Image";
import { SimpleLink } from "@cryptuoso/components/Link";
import dayjs from "@cryptuoso/libs/dayjs";
import { ActionIcon, createStyles, Group, Skeleton, Stack, Text, Tooltip, Badge, Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import { Receipt2, Refresh } from "tabler-icons-react";
import { gql, useQuery } from "urql";
import { IUserSub } from "../Subscription";
import { getSubStatusColor } from "../Subscription/SubscriptionCard";

const useStyles = createStyles((theme) => ({
    value: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1
    },
    image: {
        transform: "rotate(-15deg)"
    }
}));

const SubscriptionQuery = gql`
    query Subscription($userId: uuid!) {
        myUserSub: user_subs(
            where: { user_id: { _eq: $userId }, status: { _nin: ["canceled"] } }
            order_by: { created_at: desc_nulls_last }
            limit: 1
        ) {
            id
            status

            trialEnded: trial_ended

            activeTo: active_to
        }
    }
`;

export function Billing() {
    const { classes } = useStyles();
    const { data: session }: any = useSession();
    const [result, reexecuteQuery] = useQuery<
        {
            myUserSub: IUserSub[];
        },
        { userId: string }
    >({ query: SubscriptionQuery, variables: { userId: session?.user?.userId } });
    const { data, fetching, error } = result;
    const myUserSub = data?.myUserSub[0];
    let expires = "";
    let expiresDate = "";
    if (myUserSub) {
        if (myUserSub.status === "trial" && myUserSub.trialEnded) {
            expires = dayjs.utc().to(myUserSub.trialEnded);
            expiresDate = dayjs.utc(myUserSub.trialEnded).format("YYYY-MM-DD HH:mm:ss UTC");
        } else if (myUserSub.status === "active" && myUserSub.activeTo) {
            expires = dayjs.utc().to(myUserSub.activeTo);
            expiresDate = dayjs.utc(myUserSub.activeTo).format("YYYY-MM-DD HH:mm:ss UTC");
        }
    }
    if (error) console.error(error);

    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Subscription"
                left={
                    myUserSub ? (
                        <Badge color={getSubStatusColor(myUserSub?.status)} size="sm">
                            {myUserSub?.status}
                        </Badge>
                    ) : (
                        <Skeleton height={18} circle />
                    )
                }
                right={
                    <Group spacing="xs">
                        <Button
                            component={SimpleLink}
                            href="/app/billing"
                            color="gray"
                            variant="subtle"
                            compact
                            uppercase
                            rightIcon={<Receipt2 size={18} />}
                        >
                            DETAILS
                        </Button>
                        <RefreshAction reexecuteQuery={reexecuteQuery} />
                    </Group>
                }
            />
            <Group position="apart">
                <Stack spacing="xs" mt={25}>
                    {myUserSub ? (
                        <Tooltip
                            transition="fade"
                            transitionDuration={500}
                            transitionTimingFunction="ease"
                            placement="start"
                            label={expiresDate}
                        >
                            <Text className={classes.value}>{expires}</Text>
                        </Tooltip>
                    ) : (
                        <Skeleton height={8} width="30%" />
                    )}

                    {myUserSub ? (
                        <Text size="sm" color="dimmed">
                            Expires
                        </Text>
                    ) : (
                        <Skeleton height={8} width="30%" />
                    )}
                </Stack>

                {myUserSub ? (
                    <Logo className={classes.image} height={80} width={80} />
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>
        </BaseCard>
    );
}
