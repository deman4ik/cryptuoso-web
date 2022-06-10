import { SimpleLink, TextLink } from "@cryptuoso/components/Link";
import { getPaymentStatusColor, getSubStatusColor } from "@cryptuoso/helpers/pricing";
import dayjs from "@cryptuoso/libs/dayjs";
import { Badge, Button, Group, LoadingOverlay, Modal, SimpleGrid, Stack, Text, useMantineTheme } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { gql, useMutation, useQuery } from "urql";
import { CardLine } from "../Card";
import { SubscriptionCard } from "./SubscriptionCard";
import { IUserPayment, IUserSub } from "./types";

const UserPaymentQuery = gql`
    query SubscriptionWithPayment($userId: uuid!) {
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
                priceTotal: price_total
            }
            userPayments: user_payments(order_by: { created_at: desc_nulls_last }, limit: 1) {
                id
                code
                url
                status
                price
                createdAt: created_at
                expiresAt: expires_at
                subscriptionFrom: subscription_from
                subscriptionTo: subscription_to
            }
        }
    }
`;

export function CheckoutForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useMantineTheme();

    const { data: session } = useSession<true>({ required: true });
    const [result, reexecuteQuery] = useQuery<
        {
            myUserSub: IUserSub[];
        },
        { userId: string }
    >({ query: UserPaymentQuery, variables: { userId: session?.user?.userId || "" } });
    const { data, fetching, error: queryError } = result;
    const myUserSub = data?.myUserSub[0];
    const payment = myUserSub?.userPayments && myUserSub?.userPayments[0];

    if (queryError) console.error(queryError);

    const [, userSubCheckout] = useMutation<
        { result: { id: string } },
        {
            userSubId?: string;
        }
    >(
        gql`
            mutation userSubCheckout($userSubId: uuid!) {
                userSubCheckout(userSubId: $userSubId) {
                    result: userPayment {
                        id
                    }
                }
            }
        `
    );

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        const result = await userSubCheckout({
            userSubId: myUserSub?.id
        });

        console.log(result);
        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result?.id) {
            setLoading(false);
            reexecuteQuery({ requestPolicy: "network-only" });
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <LoadingOverlay visible={fetching || loading} />

            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "md", cols: 1 }]} mt="md">
                <Stack>
                    <Text transform="uppercase" color="dimmed" weight={700}>
                        Your subscription
                    </Text>
                    <CardLine
                        mt={0}
                        title="Plan"
                        loading={fetching}
                        value={myUserSub?.subscription.name}
                        valueTooltip={
                            <span style={{ whiteSpace: "pre-line" }}>{myUserSub?.subscription.description}</span>
                        }
                    />

                    <CardLine mt={0} title="Period" loading={!myUserSub} value={myUserSub?.subscriptionOption.name} />

                    <CardLine
                        mt={0}
                        title="Status"
                        loading={!myUserSub}
                        value={
                            <Badge size="md" color={getSubStatusColor(myUserSub?.status)}>
                                {myUserSub?.status}
                            </Badge>
                        }
                    />
                </Stack>
                <Stack justify="space-between">
                    <Text transform="uppercase" color="dimmed" weight={700}>
                        Your payment
                    </Text>
                    {!payment || ["EXPIRED", "CANCELED"].includes(payment.status) ? (
                        <Stack>
                            <Text
                                align="center"
                                variant="gradient"
                                gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                size="xl"
                                weight={900}
                            >
                                ${myUserSub?.subscriptionOption.priceTotal}
                            </Text>
                            <Button
                                onClick={handleCheckout}
                                size="md"
                                variant="gradient"
                                gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                px="xl"
                            >
                                Checkout
                            </Button>
                            <Text color="dimmed" size="sm">
                                You will have 1 hour to proceed your payment
                            </Text>
                        </Stack>
                    ) : (
                        <Stack>
                            <CardLine
                                mt={0}
                                title="Code"
                                loading={fetching}
                                value={
                                    <TextLink size="md" href={payment.url} target="_blank">
                                        {payment.code}
                                    </TextLink>
                                }
                            />
                            <CardLine
                                mt={0}
                                title="Price"
                                loading={fetching}
                                value={
                                    <Text
                                        variant="gradient"
                                        gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                        size="md"
                                    >
                                        ${payment.price}
                                    </Text>
                                }
                            />
                            <CardLine
                                mt={0}
                                title="Status"
                                loading={fetching}
                                value={
                                    <Badge size="md" color={getPaymentStatusColor(payment.status)}>
                                        {payment.status}
                                    </Badge>
                                }
                            />

                            <CardLine
                                mt={0}
                                title="Expires"
                                loading={fetching}
                                value={dayjs.utc().to(dayjs.utc(payment.expiresAt))}
                                valueTooltip={dayjs.utc(payment.expiresAt).format("YYYY-MM-DD HH:mm:ss UTC")}
                            />
                            <Group>
                                <Button
                                    component={SimpleLink}
                                    href={payment.url || ""}
                                    target="_blank"
                                    size="md"
                                    variant="gradient"
                                    gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                    px="xl"
                                >
                                    Pay
                                </Button>
                                <Button
                                    size="md"
                                    variant="gradient"
                                    gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                    px="xl"
                                >
                                    Check Payment
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </Stack>
            </SimpleGrid>
        </div>
    );
}
