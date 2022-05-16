import React from "react";
import {
    createStyles,
    Table,
    Progress,
    Anchor,
    Text,
    Group,
    ScrollArea,
    Card,
    LoadingOverlay,
    Button,
    ActionIcon,
    Badge
} from "@mantine/core";
import { gql, useQuery } from "urql";
import { useSession } from "next-auth/react";
import { IUserPayment } from "./types";
import { TextLink } from "@cryptuoso/components/Link/TextLink";
import dayjs from "@cryptuoso/libs/dayjs";
import { Refresh } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));

const PaymentHistoryQuery = gql`
    query Subscription($userId: uuid!) {
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
    const { data: session }: any = useSession();
    const [result, reexecuteQuery] = useQuery<
        {
            userPayments: IUserPayment[];
        },
        { userId: string }
    >({ query: PaymentHistoryQuery, variables: { userId: session?.user?.userId } });
    const { data, fetching, error } = result;
    const userPayments = data?.userPayments || [];
    if (data) console.log(data);
    if (error) console.error(error);
    //TODO: Mobile Cards
    const rows = userPayments.map((payment) => {
        return (
            <tr key={payment.id}>
                <td>
                    <TextLink href={payment.url}>{payment.code}</TextLink>
                </td>
                <td>{payment.price} $</td>
                <td>
                    <Badge size="md">{payment.status}</Badge>
                </td>
                {/* TODO: Status colors */}
                <td>{dayjs.utc(payment.createdAt).format("YYYY-MM-DD HH:mm UTC")}</td>
                <td>{dayjs.utc(payment.expiresAt).format("YYYY-MM-DD HH:mm UTC")}</td>
                <td>{`${payment?.userSub?.subscription.name} ${payment?.userSub?.subscriptionOption.name}`}</td>
                <td>
                    {`${dayjs.utc(payment.subscriptionFrom).format("YYYY-MM-DD")} - ${dayjs
                        .utc(payment.subscriptionTo)
                        .format("YYYY-MM-DD")}`}
                </td>
            </tr>
        );
    });

    return (
        <Card shadow="sm" p="sm" radius="lg" className={classes.card}>
            <LoadingOverlay visible={fetching} />
            <Group position="apart" mb="md">
                <Text size="md" weight={900} transform="uppercase" color="dimmed">
                    Payment History
                </Text>

                <ActionIcon
                    color="gray"
                    variant="hover"
                    onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}
                >
                    <Refresh size={18} />
                </ActionIcon>
            </Group>
            <ScrollArea>
                <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
                    <thead>
                        <tr>
                            <th>Charge</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Expires</th>
                            <th>Subscription</th>
                            <th>Period</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </ScrollArea>
        </Card>
    );
}
