import { useSession } from "next-auth/react";
import { BaseCard, CardHeader, RefreshAction } from "@cryptuoso/components/App/Card";
import { gql, useMutation, useQuery } from "urql";
import { UserNotification } from "@cryptuoso/types";
import { NotificationsQuery } from "@cryptuoso/queries";
import { Button, Center, Group, Pagination, Skeleton, Stack, Text } from "@mantine/core";
import { NotificationComponent } from "./NotificationItem";
import { ListCheck } from "tabler-icons-react";
import { useEffect, useState } from "react";
import round from "@cryptuoso/helpers/round";
import { sleep } from "@cryptuoso/helpers";

const ITEMS_LIMIT = 12;

export function NotificationsList() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession<true>({ required: true });

    const [page, setPage] = useState(1);
    const [result, reexecuteQuery] = useQuery<
        {
            unreadNotificationsCount: {
                aggregate: {
                    count: number;
                };
            };
            allNotificationsCount: {
                aggregate: {
                    count: number;
                };
            };
            notifications: UserNotification<any>[];
        },
        { userId: string; offset: number; limit: number }
    >({
        query: NotificationsQuery,
        variables: { userId: session?.user?.userId || "", offset: (page - 1) * ITEMS_LIMIT, limit: ITEMS_LIMIT }
    });
    const { data, fetching, error: queryError } = result;
    if (queryError) console.error(queryError);
    const notifications = data?.notifications;
    const allNotificationsCount = data?.allNotificationsCount?.aggregate?.count || 0;

    const rows = notifications?.map((notification) => (
        <NotificationComponent notification={notification} key={notification.id} />
    ));

    const [, markAllNotifications] = useMutation<
        { result: { affected_rows: number } },
        {
            userId: string;
        }
    >(
        gql`
            mutation MarkAllNotifications($userId: uuid!) {
                result: update_notifications(
                    _set: { readed: true }
                    where: { readed: { _eq: false }, user_id: { _eq: $userId } }
                ) {
                    affected_rows
                }
            }
        `
    );

    const [, markNotifications] = useMutation<
        { result: { affected_rows: number } },
        {
            userId: string;
            ids: string[];
        }
    >(
        gql`
            mutation MarkNotifications($userId: uuid!, $ids: [uuid!]) {
                result: update_notifications(
                    _set: { readed: true }
                    where: { readed: { _eq: false }, user_id: { _eq: $userId }, id: { _in: $ids } }
                ) {
                    affected_rows
                }
            }
        `
    );

    const handleMark = async () => {
        setLoading(true);
        setError(null);

        const result = await markAllNotifications({
            userId: session?.user?.userId || ""
        });

        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result) {
            setLoading(false);
            reexecuteQuery();
        }
    };

    useEffect(() => {
        const mutate = async () => {
            await sleep(2000);
            const result = await markNotifications({
                userId: session?.user?.userId || "",
                ids: notifications?.map(({ id }) => id) || []
            });
            if (result?.error) console.error(result?.error);
            else if (result?.data?.result) {
                reexecuteQuery();
            }
        };

        if (notifications && Array.isArray(notifications) && notifications.length) {
            mutate().catch(console.error);
        }
    }, [notifications, markNotifications, session?.user?.userId, reexecuteQuery]);

    return (
        <BaseCard fetching={fetching} justify="flex-start">
            <CardHeader
                title="Notifications"
                right={
                    <Group spacing={0} position="right" align="flex-start">
                        <Button
                            color="gray"
                            variant="subtle"
                            compact
                            uppercase
                            rightIcon={<ListCheck size={18} />}
                            onClick={() => handleMark()}
                            loading={loading}
                            styles={(theme) => ({
                                rightIcon: {
                                    marginLeft: 5
                                }
                            })}
                        >
                            Mark All As Readed
                        </Button>

                        <RefreshAction reexecuteQuery={reexecuteQuery} />
                    </Group>
                }
            />
            {(queryError || error) && (
                <Text color="red" size="sm" mt="sm" weight={500}>
                    {queryError || error}
                </Text>
            )}

            {rows && Array.isArray(rows) && rows.length ? (
                <Stack spacing="sm">
                    {rows}
                    {allNotificationsCount > ITEMS_LIMIT && (
                        <Pagination
                            page={page}
                            onChange={setPage}
                            total={round(allNotificationsCount / ITEMS_LIMIT)}
                            withEdges
                        />
                    )}
                </Stack>
            ) : (
                <Center>
                    <Text weight={500}>No notifications yet</Text>
                </Center>
            )}
        </BaseCard>
    );
}
