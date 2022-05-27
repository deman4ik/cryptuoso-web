import React from "react";
import { createStyles, ActionIcon, Switch } from "@mantine/core";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "urql";
import { Refresh } from "tabler-icons-react";
import { BaseCard, CardHeader, CardLine } from "../Card";
import { User } from "@cryptuoso/helpers/types";
import { UserAuthData, UserSession } from "@cryptuoso/helpers/types";

const UserQuery = gql`
    query UserProfile($userId: uuid!) {
        myUser: users(where: { id: { _eq: $userId } }) {
            id
            email
            name
            telegramId: telegram_id
            telegramUsername: telegram_username
            roles
            access
            status
            settings
        }
    }
`;

export function ProfileCard() {
    const { data: session } = useSession<true>({ required: true });

    const [result, reexecuteQuery] = useQuery<
        {
            myUser: User[];
        },
        { userId: string }
    >({
        query: UserQuery,
        variables: {
            userId: session?.user?.userId || ""
        }
    });

    const { data, fetching, error } = result;
    const myUser = data?.myUser[0];

    if (error) console.error(error);
    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Profile"
                right={
                    <ActionIcon
                        color="gray"
                        variant="hover"
                        onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}
                    >
                        <Refresh size={18} />
                    </ActionIcon>
                }
            />

            <CardLine title="Name" loading={!myUser} value={myUser?.name} />
            <CardLine title="Email" loading={!myUser} value={myUser?.email} />
            <CardLine title="Telegram" loading={!myUser} value={myUser?.telegramUsername || myUser?.telegramId} />
            <CardLine
                title="Telegram Notifications"
                loading={!myUser}
                value={
                    <Switch
                        checked={!!myUser?.telegramId && myUser?.settings.notifications.trading.telegram === true}
                        disabled={!myUser?.telegramId}
                        onLabel="ON"
                        offLabel="OFF"
                        size="md"
                    />
                }
            />
        </BaseCard>
    );
}
