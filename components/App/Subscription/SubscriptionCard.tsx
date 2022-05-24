import React from "react";
import { Group, Badge, ActionIcon, Button, DefaultMantineColor } from "@mantine/core";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "urql";
import dayjs from "@cryptuoso/libs/dayjs";
import { Receipt2, Refresh } from "tabler-icons-react";
import { IUserSub } from "@cryptuoso/components/App/Subscription";
import { BaseCard, CardHeader, CardLine, RefreshAction } from "@cryptuoso/components/App/Card";

const SubscriptionQuery = gql`
    query Subscription($userId: uuid!) {
        myUserSub: user_subs(
            where: { user_id: { _eq: $userId }, status: { _nin: ["canceled"] } }
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

export function getSubStatusColor(status?: IUserSub["status"]): DefaultMantineColor {
    switch (status) {
        case "pending":
            return "blue";
        case "expiring":
            return "yellow";
        case "active":
        case "trial":
            return "green";
        case "expired":
        case "canceled":
            return "red";
        default:
            return "gray";
    }
}

export function SubscriptionCard() {
    const { data: session }: any = useSession();
    const [result, reexecuteQuery] = useQuery<
        {
            myUserSub: IUserSub[];
        },
        { userId: string }
    >({ query: SubscriptionQuery, variables: { userId: session?.user?.userId } });
    const { data, fetching, error } = result;
    const myUserSub = data?.myUserSub[0];

    if (error) console.error(error);

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
    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Subscription"
                right={
                    <Group spacing="xs">
                        <Button color="gray" variant="subtle" compact uppercase rightIcon={<Receipt2 size={18} />}>
                            Change Plan
                        </Button>
                        <RefreshAction reexecuteQuery={reexecuteQuery} />
                    </Group>
                }
            />

            <CardLine
                title="Plan"
                loading={!myUserSub}
                value={myUserSub?.subscription.name}
                valueTooltip={<span style={{ whiteSpace: "pre-line" }}>{myUserSub?.subscription.description}</span>}
            />

            <CardLine title="Period" loading={!myUserSub} value={myUserSub?.subscriptionOption.name} />

            <CardLine
                title="Status"
                loading={!myUserSub}
                value={
                    <Badge size="md" color={getSubStatusColor(myUserSub?.status)}>
                        {myUserSub?.status}
                    </Badge>
                }
            />

            <CardLine title="Expires" loading={!myUserSub} value={expires} valueTooltip={expiresDate} />
        </BaseCard>
    );
}
