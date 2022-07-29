import { BaseCard, CardHeader, RefreshAction } from "@cryptuoso/components/App/Card";
import { Logo } from "@cryptuoso/components/Image";
import { SimpleLink } from "@cryptuoso/components/Link";
import { getSubStatusColor } from "@cryptuoso/helpers/pricing";
import dayjs from "@cryptuoso/libs/dayjs";
import { UserSub } from "@cryptuoso/types";
import { ActionIcon, createStyles, Group, Skeleton, Stack, Text, Tooltip, Badge, Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import { Receipt2, Refresh } from "tabler-icons-react";
import { gql, useQuery } from "urql";

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
    const { data: session } = useSession<true>({ required: true });
    const [result, reexecuteQuery] = useQuery<
        {
            myUserSub: UserSub[];
        },
        { userId: string }
    >({ query: SubscriptionQuery, variables: { userId: session?.user?.userId || "" } });
    const { data, fetching, error } = result;
    const myUserSub = data?.myUserSub[0];
    let expires = "";
    let expiresDate = "";
    if (myUserSub) {
        if (myUserSub.status === "trial" && myUserSub.trialEnded) {
            expires = dayjs.utc().to(dayjs.utc(myUserSub.trialEnded));
            expiresDate = dayjs.utc(myUserSub.trialEnded).format("YYYY-MM-DD HH:mm:ss UTC");
        } else if (myUserSub.status === "active" && myUserSub.activeTo) {
            expires = dayjs.utc().to(dayjs.utc(myUserSub.activeTo));
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
                        <Tooltip
                            transition="fade"
                            transitionDuration={500}
                            label={
                                <Text transform="capitalize" size="sm" weight={500}>
                                    {myUserSub?.status}
                                </Text>
                            }
                            color={getSubStatusColor(myUserSub?.status)}
                            events={{ hover: true, touch: true, focus: false }}
                        >
                            <Badge color={getSubStatusColor(myUserSub?.status)} size="sm">
                                {myUserSub?.status}
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
                            href="/app/accounts"
                            color="gray"
                            variant="subtle"
                            compact
                            uppercase
                            rightIcon={<Receipt2 size={18} />}
                            styles={(theme) => ({
                                rightIcon: {
                                    marginLeft: 5
                                }
                            })}
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
                            label={expiresDate}
                            events={{ hover: true, touch: true, focus: false }}
                        >
                            <Text className={classes.value} weight={500}>
                                {expires}
                            </Text>
                        </Tooltip>
                    ) : (
                        <Skeleton height={8} width="30%" />
                    )}

                    {myUserSub ? (
                        <Text size="sm" color="dimmed" weight={500}>
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
