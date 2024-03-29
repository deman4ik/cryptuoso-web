import React from "react";
import {
    createStyles,
    Text,
    Group,
    Card,
    LoadingOverlay,
    ActionIcon,
    Badge,
    Skeleton,
    DefaultMantineColor
} from "@mantine/core";
import { gql, useQuery } from "urql";
import { useSession } from "next-auth/react";
import { TextLink } from "@cryptuoso/components/Link/TextLink";
import dayjs from "@cryptuoso/libs/dayjs";
import { Refresh } from "tabler-icons-react";
import { ResponsiveTable } from "../Table/Table";
import { getPaymentStatusColor } from "@cryptuoso/helpers/pricing";
import { UserPayment } from "@cryptuoso/types";
import { refetchOptions } from "@cryptuoso/libs/graphql";

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));

const PaymentHistoryQuery = gql`
    query UserPayments($userId: uuid!) {
        userPayments: user_payments(where: { user_id: { _eq: $userId } }, order_by: { created_at: desc_nulls_last }) {
            id
            code
            url
            status
            price
            createdAt: created_at
            expiresAt: expires_at
            subscriptionFrom: subscription_from
            subscriptionTo: subscription_to
            userSub: user_sub {
                subscriptionOption {
                    name
                }
                subscription {
                    name
                }
            }
        }
    }
`;

export function PaymentHistory() {
    const { classes, theme } = useStyles();
    const { data: session } = useSession<true>({ required: true });
    const [result, reexecuteQuery] = useQuery<
        {
            userPayments: UserPayment[];
        },
        { userId: string }
    >({ query: PaymentHistoryQuery, variables: { userId: session?.user?.userId || "" } });
    const { data, fetching, error } = result;
    const userPayments = data?.userPayments || [];

    if (error) console.error(error);

    /* eslint-disable react/jsx-key */
    const tableData = {
        titles: ["Charge", "Price", "Status", "Created", "Expires", "Subscription", "Period"],
        rows: userPayments.map((payment) => {
            return {
                id: payment.id,
                values: [
                    <Group spacing={0} position="center">
                        <TextLink size="md" href={payment.url} target="_blank" weight={500} align="center">
                            {payment.code}
                        </TextLink>
                    </Group>,
                    <Text size="md" weight={500} align="center">
                        ${payment.price}
                    </Text>,
                    <Group spacing={0} position="center">
                        <Badge size="lg" color={getPaymentStatusColor(payment.status)}>
                            {payment.status}
                        </Badge>
                    </Group>,
                    <Text size="sm" weight={500} align="center">
                        {dayjs.utc(payment.createdAt).format("YYYY-MM-DD HH:mm:ss UTC")}
                    </Text>,
                    <Text size="sm" weight={500} align="center">
                        {dayjs.utc(payment.expiresAt).format("YYYY-MM-DD HH:mm:ss UTC")}
                    </Text>,
                    <Text
                        size="sm"
                        weight={500}
                        align="center"
                    >{`${payment?.userSub?.subscription.name} ${payment?.userSub?.subscriptionOption.name}`}</Text>,
                    <Text size="sm" weight={500} align="center">{`${dayjs
                        .utc(payment.subscriptionFrom)
                        .format("YYYY-MM-DD")} - ${dayjs.utc(payment.subscriptionTo).format("YYYY-MM-DD")}`}</Text>
                ]
            };
        })
    };
    /* eslint-enable react/jsx-key */

    return (
        <Card shadow="sm" p="sm" radius="lg" className={classes.card}>
            <LoadingOverlay visible={fetching} />
            <Group position="apart" mb="md">
                <Text size="md" weight={900} transform="uppercase" color="dimmed">
                    Payment History
                </Text>

                <ActionIcon color="gray" variant="subtle" onClick={() => reexecuteQuery(refetchOptions)}>
                    <Refresh size={18} />
                </ActionIcon>
            </Group>
            {userPayments && userPayments.length > 0 ? (
                <ResponsiveTable data={tableData} breakpoint="xl" />
            ) : (
                <Skeleton height={50} width="100%" />
            )}
        </Card>
    );
}
