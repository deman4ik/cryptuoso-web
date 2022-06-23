import React, { useState } from "react";
import {
    Group,
    Badge,
    ActionIcon,
    Button,
    Text,
    Modal,
    MantineNumberSize,
    MantineShadow,
    Sx,
    Stack,
    useMantineTheme,
    SimpleGrid,
    Divider
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { gql, useMutation, useQuery } from "urql";
import dayjs from "@cryptuoso/libs/dayjs";
import { ArrowRight, Receipt, Receipt2, Refresh, Wallet, ZoomMoney } from "tabler-icons-react";
import { ChooseSubForm, IUserSub } from "@cryptuoso/components/App/Subscription";
import { BaseCard, CardHeader, CardLine, RefreshAction } from "@cryptuoso/components/App/Card";
import { getPaymentStatusColor, getSubStatusColor } from "@cryptuoso/helpers/pricing";
import { SimpleLink, TextLink } from "@cryptuoso/components/Link";

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

export function SubscriptionCard({ onSuccess, sx }: { onSuccess?: () => void; sx?: Sx }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useMantineTheme();

    const [changePlanModalOpened, setChangePlanModalOpened] = useState(false);
    const { data: session } = useSession<true>({ required: true });
    const [result, reexecuteQuery] = useQuery<
        {
            myUserSub: IUserSub[];
        },
        { userId: string }
    >({ query: SubscriptionQuery, variables: { userId: session?.user?.userId || "" } });
    const { data, fetching, error: queryError } = result;
    const myUserSub = data?.myUserSub[0];
    const payment = myUserSub?.userPayments && myUserSub?.userPayments[0];

    if (queryError) console.error(queryError);

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

    const [, userSubCheckout] = useMutation<
        { result: string },
        {
            userSubId?: string;
        }
    >(
        gql`
            mutation userSubCheckout($userSubId: uuid!) {
                userSubCheckout(userSubId: $userSubId) {
                    result: id
                }
            }
        `
    );

    const [, userSubCheckPayment] = useMutation<
        { result: string },
        {
            chargeId?: string;
        }
    >(
        gql`
            mutation userSubCheckPayment($chargeId: uuid!) {
                userSubCheckPayment(chargeId: $chargeId) {
                    result: id
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

        setLoading(false);
        if (result?.error) {
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result) {
            reexecuteQuery({ requestPolicy: "network-only" });
        }
    };

    const handleCheckPayment = async () => {
        setLoading(true);
        setError(null);

        const result = await userSubCheckPayment({
            chargeId: payment?.id
        });

        setLoading(false);
        if (result?.error) {
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result) {
            reexecuteQuery({ requestPolicy: "network-only" });
        }
    };

    return (
        <BaseCard fetching={fetching || loading} sx={sx} justify="flex-start">
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "md", cols: 1 }]} spacing="xl">
                <Stack>
                    <CardHeader title="Subscription" />
                    <CardLine
                        mt={0}
                        title="Plan"
                        loading={!myUserSub}
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

                    <CardLine mt={0} title="Expires" loading={!myUserSub} value={expires} valueTooltip={expiresDate} />

                    <Button
                        onClick={() => setChangePlanModalOpened(true)}
                        size="md"
                        variant="subtle"
                        px="xl"
                        leftIcon={<Receipt2 size={18} />}
                    >
                        Change Plan
                    </Button>
                </Stack>

                {!payment || ["EXPIRED", "CANCELED"].includes(payment.status) ? (
                    <Stack justify="space-between">
                        <CardHeader
                            title="Checkout new payment"
                            right={<RefreshAction reexecuteQuery={reexecuteQuery} />}
                        />
                        <Stack mb="xl" spacing="lg">
                            <Text
                                align="center"
                                variant="gradient"
                                gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                sx={{ fontSize: 30 }}
                                weight={900}
                            >
                                ${myUserSub?.subscriptionOption.priceTotal}
                            </Text>
                            {error && (
                                <Text color="red" size="sm" mt="sm" weight={500}>
                                    {error}
                                </Text>
                            )}
                            <Button
                                onClick={handleCheckout}
                                size="md"
                                variant="gradient"
                                gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                px="xl"
                                leftIcon={<Receipt size={18} />}
                            >
                                Checkout
                            </Button>

                            <Text color="dimmed" size="sm" weight={500} align="center">
                                You will have 1 hour to proceed your payment
                            </Text>
                        </Stack>
                    </Stack>
                ) : (
                    <Stack>
                        <CardHeader
                            title="Proceed payment"
                            right={
                                <Group spacing={0} position="right" align="flex-start">
                                    <Button
                                        color="gray"
                                        variant="subtle"
                                        compact
                                        uppercase
                                        onClick={handleCheckout}
                                        leftIcon={<Receipt size={18} />}
                                        styles={(theme) => ({
                                            rightIcon: {
                                                marginLeft: 5
                                            }
                                        })}
                                    >
                                        Checkout
                                    </Button>
                                    <RefreshAction reexecuteQuery={reexecuteQuery} />
                                </Group>
                            }
                        />
                        <CardLine
                            mt={0}
                            title="Code"
                            loading={fetching}
                            value={
                                <TextLink size="md" href={payment.url} target="_blank" weight={500}>
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
                                    weight={500}
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
                        {error && (
                            <Text color="red" size="sm" mt="sm" weight={500}>
                                {error}
                            </Text>
                        )}
                        {onSuccess && ["active", "trial", "expiring"].includes(myUserSub?.status) ? (
                            <Button
                                onClick={onSuccess}
                                size="md"
                                variant="gradient"
                                gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                px="xl"
                                rightIcon={<ArrowRight size={18} />}
                            >
                                Next
                            </Button>
                        ) : (
                            <Group grow>
                                {dayjs.utc(payment?.expiresAt).valueOf() > dayjs.utc().valueOf() ? (
                                    <Button
                                        component={SimpleLink}
                                        href={payment.url || ""}
                                        target="_blank"
                                        size="md"
                                        variant="gradient"
                                        gradient={{ from: "violet", to: "pink", deg: 45 }}
                                        px="xl"
                                        leftIcon={<Wallet size={18} />}
                                    >
                                        Pay
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleCheckout}
                                        size="md"
                                        variant="gradient"
                                        gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                        px="xl"
                                        leftIcon={<Receipt size={18} />}
                                    >
                                        Checkout
                                    </Button>
                                )}
                                <Button
                                    onClick={handleCheckPayment}
                                    size="md"
                                    variant="gradient"
                                    gradient={{ from: theme.primaryColor, to: "teal", deg: 45 }}
                                    px="xl"
                                    leftIcon={<ZoomMoney size={18} />}
                                >
                                    Check Payment
                                </Button>
                            </Group>
                        )}
                    </Stack>
                )}
            </SimpleGrid>
            <Modal
                opened={changePlanModalOpened}
                onClose={() => setChangePlanModalOpened(false)}
                title={
                    <Text transform="uppercase" weight={900} align="center">
                        Change Subscription Plan
                    </Text>
                }
                size="xl"
            >
                <ChooseSubForm
                    onSuccess={() => {
                        setChangePlanModalOpened(false);
                        reexecuteQuery({ requestPolicy: "network-only" });
                    }}
                />
            </Modal>
        </BaseCard>
    );
}
