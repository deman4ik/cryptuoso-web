import React, { useState } from "react";
import { Text, ActionIcon, Switch, Group, Button, Modal } from "@mantine/core";
import { useSession } from "next-auth/react";
import { gql, useMutation, useQuery } from "urql";
import { Edit, Key, Mail, Refresh } from "tabler-icons-react";
import { BaseCard, CardHeader, CardLine } from "../Card";
import { User } from "@cryptuoso/helpers/types";
import { UserAuthData, UserSession } from "@cryptuoso/helpers/types";
import { TelegramLoginData, TelegramLoginWidget } from "@cryptuoso/components/Auth";
import { ChangeNameForm } from "./changeNameForm";
import { ChangeEmailForm } from "./ChangeEmailForm";
import { ChangePasswordForm } from "./ChangePasswordForm";

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
    const [changeNameModalOpened, setChangeNameModalOpened] = useState(false);
    const [changeEmailModalOpened, setChangeEmailModalOpened] = useState(false);
    const [changePasswordModalOpened, setChangePasswordModalOpened] = useState(false);
    const [createAccModalOpened, setCreateAccModalOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const { data, fetching, error: queryError } = result;
    const myUser = data?.myUser[0];

    if (error) console.error(error);

    const [, authSetTelegram] = useMutation<
        { result: { result: string } },
        {
            data: TelegramLoginData;
        }
    >(
        gql`
            mutation authSetTelegram($data: TelegramInput!) {
                result: authSetTelegram(data: $data) {
                    result
                }
            }
        `
    );

    const [, userSetNotificationSettings] = useMutation<
        { result: any },
        {
            tradingTelegram?: boolean;
        }
    >(
        gql`
            mutation userSetNotificationSettings($tradingTelegram: Boolean) {
                result: userSetNotificationSettings(tradingTelegram: $tradingTelegram)
            }
        `
    );

    const handleSetTelegram = async (data: TelegramLoginData) => {
        setLoading(true);
        setError(null);

        const result = await authSetTelegram({
            data
        });

        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result) {
            setLoading(false);
            reexecuteQuery();
        }
    };

    const setTelegramNotifcations = async (checked: boolean) => {
        setLoading(true);
        setError(null);

        const result = await userSetNotificationSettings({
            tradingTelegram: checked
        });

        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result) {
            setLoading(false);
            reexecuteQuery();
        }
    };
    return (
        <BaseCard fetching={fetching || loading}>
            <CardHeader
                title="Profile"
                right={
                    <Group spacing={0} position="right" align="flex-start">
                        {myUser?.email && (
                            <Button
                                color="gray"
                                variant="subtle"
                                compact
                                uppercase
                                rightIcon={<Key size={18} />}
                                onClick={() => setChangePasswordModalOpened(true)}
                                styles={(theme) => ({
                                    rightIcon: {
                                        marginLeft: 5
                                    }
                                })}
                            >
                                Change password
                            </Button>
                        )}
                        <ActionIcon
                            color="gray"
                            variant="hover"
                            onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}
                        >
                            <Refresh size={18} />
                        </ActionIcon>
                    </Group>
                }
            />

            <CardLine
                mt={0}
                title="Name"
                loading={!myUser}
                value={
                    <Group spacing="xs">
                        <Text size="sm" weight={500}>
                            {myUser?.name}
                        </Text>
                        <ActionIcon
                            color="gray"
                            variant="hover"
                            size="sm"
                            onClick={() => setChangeNameModalOpened(true)}
                        >
                            <Edit />
                        </ActionIcon>
                    </Group>
                }
            />
            <CardLine
                title="Email"
                loading={!myUser}
                value={
                    myUser?.email ? (
                        <Group spacing="xs">
                            <Text size="sm" weight={500}>
                                {myUser?.email}
                            </Text>
                            <ActionIcon
                                color="gray"
                                variant="hover"
                                size="sm"
                                onClick={() => setChangeEmailModalOpened(true)}
                            >
                                <Edit />
                            </ActionIcon>
                        </Group>
                    ) : (
                        <Button
                            color="gray"
                            variant="subtle"
                            compact
                            uppercase
                            rightIcon={<Mail size={18} />}
                            onClick={() => setChangeEmailModalOpened(true)}
                            styles={(theme) => ({
                                rightIcon: {
                                    marginLeft: 5
                                }
                            })}
                        >
                            Set Email
                        </Button>
                    )
                }
            />
            <CardLine
                title={myUser?.telegramUsername || myUser?.telegramId ? "Telegram" : "Link your Telegram Account"}
                loading={!myUser}
                value={
                    myUser?.telegramUsername ||
                    myUser?.telegramId || (
                        <TelegramLoginWidget onAuth={(data) => handleSetTelegram(data)} buttonSize="small" />
                    )
                }
            />
            {myUser?.telegramId && (
                <CardLine
                    title="Telegram Notifications"
                    loading={!myUser}
                    value={
                        <Switch
                            checked={!!myUser?.telegramId && myUser?.settings.notifications.trading.telegram === true}
                            onChange={(event) => setTelegramNotifcations(event.currentTarget.checked)}
                            onLabel="ON"
                            offLabel="OFF"
                            size="md"
                        />
                    }
                />
            )}
            {error && (
                <Text color="red" size="sm" mt="sm" weight={500}>
                    {error}
                </Text>
            )}
            <Modal
                opened={changeNameModalOpened}
                onClose={() => setChangeNameModalOpened(false)}
                title={
                    <Text transform="uppercase" weight={900} align="center">
                        Change Name
                    </Text>
                }
            >
                <ChangeNameForm
                    name={myUser?.name}
                    onSuccess={() => {
                        reexecuteQuery({ requestPolicy: "network-only" });
                        setChangeNameModalOpened(false);
                    }}
                />
            </Modal>
            <Modal
                opened={changeEmailModalOpened}
                onClose={() => setChangeEmailModalOpened(false)}
                title={
                    <Text transform="uppercase" weight={900} align="center">
                        Change Email
                    </Text>
                }
            >
                <ChangeEmailForm
                    onSuccess={() => {
                        reexecuteQuery({ requestPolicy: "network-only" });
                        setChangeEmailModalOpened(false);
                    }}
                />
            </Modal>
            <Modal
                opened={changePasswordModalOpened}
                onClose={() => setChangePasswordModalOpened(false)}
                title={
                    <Text transform="uppercase" weight={900} align="center">
                        Change Password
                    </Text>
                }
            >
                <ChangePasswordForm
                    onSuccess={() => {
                        setChangePasswordModalOpened(false);
                    }}
                />
            </Modal>
        </BaseCard>
    );
}
