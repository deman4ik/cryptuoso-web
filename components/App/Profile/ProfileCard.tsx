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
    ActionIcon,
    LoadingOverlay
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

interface User {
    id: string;
    email: string;
    name: string;
    telegramId: string;
    telegramUsername: string;
    roles: { defaultRole: string; allowedRoles: string[] };
    access: number;
    status: number;
    settings: {
        notifications: {
            news: {
                email: boolean;
                telegram: boolean;
            };
            trading: {
                email: boolean;
                telegram: boolean;
            };
            signals: {
                email: boolean;
                telegram: boolean;
            };
        };
    };
}

export function ProfileCard() {
    const { classes } = useStyles();

    const { data: session }: any = useSession();

    const [result, reexecuteQuery] = useQuery<
        {
            myUser: User[];
        },
        { userId: string }
    >({
        query: UserQuery,
        variables: {
            userId: session?.user?.userId
        }
    });

    const { data, fetching, error } = result;
    const myUser = data?.myUser[0];
    if (data) console.log(data);
    if (error) console.error(error);
    return (
        <Card shadow="sm" p="lg" className={classes.card}>
            <LoadingOverlay visible={fetching} />
            <Group position="apart" mb="md">
                <Text size="md" weight={900} transform="uppercase">
                    Profile
                </Text>
                <ActionIcon variant="hover" onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}>
                    <Refresh size={16} />
                </ActionIcon>
            </Group>

            <Group position="apart">
                <Text size="md" weight={500} sx={{ lineHeight: 2 }}>
                    Name
                </Text>

                {myUser ? <Text size="md">{myUser?.name}</Text> : <Skeleton height={8} width="30%" />}
            </Group>
            <Group position="apart" mt="md">
                <Text size="md" weight={500} sx={{ lineHeight: 2 }}>
                    Email
                </Text>

                {myUser ? <Text size="md">{myUser?.email}</Text> : <Skeleton height={8} width="30%" />}
            </Group>

            <Group position="apart" mt="md">
                <Text size="md" weight={500} sx={{ lineHeight: 2 }}>
                    Telegram
                </Text>

                {myUser ? (
                    <Text size="md">{myUser?.telegramUsername || myUser?.telegramId}</Text>
                ) : (
                    <Skeleton height={8} width="30%" />
                )}
            </Group>
        </Card>
    );
}
