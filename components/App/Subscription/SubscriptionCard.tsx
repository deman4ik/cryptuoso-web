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
    ActionIcon,
    Button,
    Stack
} from "@mantine/core";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "urql";
import { TextLink } from "@cryptuoso/components/Link/TextLink";
import { round } from "helpers";
import dayjs from "@cryptuoso/libs/dayjs";
import { Key, QuestionMark, Receipt2, Refresh } from "tabler-icons-react";
import { IUserSub } from "@cryptuoso/components/App/Subscription/types";

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));

const SubscriptionQuery = gql`
    query Subscription($userId: uuid!) {
        myUserSub: user_subs(
            where: { user_id: { _eq: $userId }, status: { _nin: ["canceled", "expired"] } }
            order_by: { created_at: desc_nulls_last }
            limit: 1
        ) {
            id
            userId: user_id
            status
            trialStarted: trial_started
            trialEnded: trial_ended
            activeFrom: active_from
            activeTo: active_to
            subscription {
                id
                name
                description
            }
            subscriptionOption {
                code
                name
            }
        }
    }
`;

export function SubscriptionCard() {
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
    if (data) console.log(data);
    if (error) console.error(error);

    let expires = "";
    let expiresDate = "";
    if (myUserSub) {
        if (myUserSub.status === "trial" && myUserSub.trialEnded) {
            expires = dayjs.utc().to(myUserSub.trialEnded);
            expiresDate = `${dayjs.utc(myUserSub.trialEnded).format("YYYY-MM-DD HH:mm:ss")} UTC`;
        } else if (myUserSub.status === "active" && myUserSub.activeTo) {
            expires = dayjs.utc().to(myUserSub.activeTo);
            expiresDate = `${dayjs.utc(myUserSub.activeTo).format("YYYY-MM-DD HH:mm:ss")} UTC`;
        }
    }
    return (
        <Card shadow="sm" p="sm" radius="lg" className={classes.card}>
            <LoadingOverlay visible={fetching} />
            <Group position="apart" mb="md">
                <Text size="md" weight={900} transform="uppercase" color="dimmed">
                    Subscription
                </Text>
                <Group spacing="xs">
                    <Button color="gray" variant="subtle" compact uppercase rightIcon={<Receipt2 size={18} />}>
                        Change Plan
                    </Button>
                    <ActionIcon
                        color="gray"
                        variant="hover"
                        onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}
                    >
                        <Refresh size={18} />
                    </ActionIcon>
                </Group>
            </Group>

            <Group position="apart" mt="md">
                <Text size="md" weight={500} sx={{ lineHeight: 2 }}>
                    Plan
                </Text>

                {myUserSub ? (
                    <Tooltip
                        transition="fade"
                        transitionDuration={500}
                        transitionTimingFunction="ease"
                        label={<span style={{ whiteSpace: "pre-line" }}>{myUserSub.subscription.description}</span>}
                    >
                        <Text size="md">{myUserSub.subscription.name}</Text>
                    </Tooltip>
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>

            <Group position="apart" mt="md">
                <Text size="md" weight={500} sx={{ lineHeight: 2 }}>
                    Period
                </Text>

                {myUserSub ? (
                    <Text size="md"> {myUserSub.subscriptionOption.name}</Text>
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>
            <Group position="apart" mt="md">
                <Text size="md" weight={500} sx={{ lineHeight: 2 }}>
                    Expires
                </Text>

                {myUserSub ? (
                    <Tooltip
                        transition="fade"
                        transitionDuration={500}
                        transitionTimingFunction="ease"
                        label={expiresDate}
                    >
                        <Text size="md">{expires}</Text>
                    </Tooltip>
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>
            <Group position="apart" mt="md">
                <Text size="md" weight={500} sx={{ lineHeight: 2 }}>
                    Status
                </Text>
                {/* TODO: Status colors */}
                {myUserSub ? <Badge size="md">{myUserSub?.status}</Badge> : <Skeleton height={8} width="30%" />}
            </Group>
        </Card>
    );
}
