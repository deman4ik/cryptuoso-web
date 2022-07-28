import { CoinIcon } from "@cryptuoso/components/Image";
import { TextLink } from "@cryptuoso/components/Link";
import { plusNum } from "@cryptuoso/helpers";
import dayjs from "@cryptuoso/libs/dayjs";
import {
    MessageBroadcastNotification,
    OrderErrorNotification,
    PositionDirection,
    PositionStatus,
    SignalSubTradeNotification,
    SupportReplyNotification,
    TradeAction,
    UserExAccErrorNotification,
    UserNotification,
    UserPaymentStatusNotification,
    UserPortfolioBuildErrorNotification,
    UserPortfolioStatusNotification,
    UserSubErrorNotification,
    UserTradeNotification
} from "@cryptuoso/types";
import { createStyles, Group, Paper, Stack, Text, ThemeIcon, Tooltip, TypographyStylesProvider } from "@mantine/core";
import { ReactNode } from "react";
import {
    AlertTriangle,
    Check,
    Notification,
    PlayerPlay,
    PlayerPause,
    AlertCircle,
    InfoCircle,
    Help,
    Receipt2,
    WalletOff,
    CurrencyBitcoin,
    Checks
} from "tabler-icons-react";

function actionToDirection(action?: TradeAction): PositionDirection {
    if (action === TradeAction.long || action === TradeAction.closeShort) return "long";
    else return "short";
}

function ActionText({ action, ...other }: { action?: TradeAction }) {
    if (action === TradeAction.long || action === TradeAction.closeShort)
        return (
            <Text color="teal" component="span" {...other}>
                BUY
            </Text>
        );
    else
        return (
            <Text color="red" component="span" {...other}>
                SELL
            </Text>
        );
}

const useStyles = createStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "row"
    },
    icon: {
        marginRight: theme.spacing.md,
        minWidth: 34
    }
}));

export function NotificationItem({
    Icon,
    timestamp,
    readed,
    data
}: {
    Icon?: ReactNode;
    timestamp: string;
    readed: boolean;
    data: ReactNode;
}) {
    const { classes, cx } = useStyles();
    return (
        <Paper
            shadow="xs"
            p="md"
            sx={(theme) => ({
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? readed
                            ? theme.colors.dark[7]
                            : theme.colors.dark[6]
                        : readed
                        ? theme.colors.gray[0]
                        : theme.white
            })}
        >
            <div className={classes.container}>
                <div className={classes.icon}>{Icon}</div>
                <Stack spacing={0}>
                    {data}
                    <Tooltip
                        transition="fade"
                        transitionDuration={500}
                        label={dayjs.utc(timestamp).format("YYYY-MM-DD HH:mm:ss UTC")}
                    >
                        <Text size="xs" color="dimmed">
                            {dayjs.utc().to(dayjs.utc(timestamp))} {readed && <Check size={10} />}
                        </Text>
                    </Tooltip>
                </Stack>
            </div>
        </Paper>
    );
}

export function NotificationComponent({ notification }: { notification: UserNotification<any> }) {
    const { id, type, timestamp, data, readed } = notification;
    switch (type) {
        case "user.trade": {
            const {
                status,
                asset,
                entryPrice,
                exitPrice,
                entryExecuted,
                exitExecuted,
                entryAction,
                exitAction,
                profit
            } = notification.data as UserTradeNotification;

            let data;
            if (status === PositionStatus.open)
                data = (
                    <Text weight={500}>
                        Entry trade <ActionText action={entryAction} />{" "}
                        <Text weight={700} component="span">
                            {entryExecuted} {asset}
                        </Text>{" "}
                        for{" "}
                        <Text weight={700} component="span">
                            ${entryPrice}
                        </Text>
                    </Text>
                );
            else {
                const profitSum = (
                    <Text size="md" weight={500} color={profit && profit > 0 ? "teal" : "red"} component="span">
                        {plusNum(profit)}
                    </Text>
                );
                data = (
                    <Text weight={500}>
                        Exit trade <ActionText action={exitAction} />{" "}
                        <Text weight={700} component="span">
                            {exitExecuted} {asset}
                        </Text>{" "}
                        for{" "}
                        <Text weight={700} component="span">
                            ${exitPrice}
                        </Text>{" "}
                        with {profit && profit > 0 ? "profit" : "loss"} {profitSum}
                    </Text>
                );
            }

            return (
                <NotificationItem
                    key={id}
                    Icon={<CoinIcon src={asset} width={34} height={34} />}
                    timestamp={timestamp}
                    readed={readed}
                    data={data}
                />
            );
        }

        case "signal_sub.trade": {
            const { status, asset, entryPrice, exitPrice, entryAction, exitAction, profitPercent, share } =
                notification.data as SignalSubTradeNotification;

            let data;
            if (status === PositionStatus.open)
                data = (
                    <Text weight={500}>
                        Entry signal <ActionText action={entryAction} />{" "}
                        <Text weight={700} component="span">
                            {share}% of portfolio balance in {asset}
                        </Text>{" "}
                        for{" "}
                        <Text weight={700} component="span">
                            ${entryPrice}
                        </Text>
                    </Text>
                );
            else {
                const profitSum = (
                    <Text
                        size="md"
                        weight={500}
                        color={profitPercent && profitPercent > 0 ? "teal" : "red"}
                        component="span"
                    >
                        {plusNum(profitPercent, "%")}
                    </Text>
                );
                data = (
                    <Text weight={500}>
                        Exit signal <ActionText action={entryAction} />{" "}
                        <Text weight={700} component="span">
                            {share} {asset}
                        </Text>{" "}
                        for{" "}
                        <Text weight={700} component="span">
                            ${exitPrice}
                        </Text>{" "}
                        with {profitPercent && profitPercent > 0 ? "profit" : "loss"} {profitSum}
                    </Text>
                );
            }

            return (
                <NotificationItem
                    key={id}
                    Icon={<CoinIcon src={asset} width={34} height={34} />}
                    timestamp={timestamp}
                    readed={readed}
                    data={data}
                />
            );
        }
        case "user_portfolio.builded":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon size="lg" variant="light" color="blue">
                            <Check />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <Text weight={500}>
                            Portfolio is{" "}
                            <Text weight={700} component="span">
                                BUILDED
                            </Text>
                        </Text>
                    }
                />
            );
        case "user_portfolio.build_error": {
            const { error } = notification.data as UserPortfolioBuildErrorNotification;
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon size="lg" variant="light" color="red">
                            <AlertTriangle />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <Text>
                            <Text weight={700} component="span">
                                ERROR
                            </Text>{" "}
                            {error}{" "}
                            <TextLink href="/docs/support" target="_blank">
                                Please contact Support
                            </TextLink>
                        </Text>
                    }
                />
            );
        }
        case "user_portfolio.status": {
            const { status, message } = notification.data as UserPortfolioStatusNotification;

            let Icon;
            if (["started", "starting"].includes(status))
                Icon = (
                    <ThemeIcon size="lg" variant="light" color="green">
                        <PlayerPlay />
                    </ThemeIcon>
                );
            else if (["stopped", "stopping"].includes(status))
                Icon = (
                    <ThemeIcon size="lg" variant="light" color="red">
                        <PlayerPause />
                    </ThemeIcon>
                );
            else if (status === "error")
                Icon = (
                    <ThemeIcon size="lg" variant="light" color="red">
                        <AlertTriangle />
                    </ThemeIcon>
                );
            else
                Icon = (
                    <ThemeIcon size="lg" variant="light">
                        <Notification />
                    </ThemeIcon>
                );
            return (
                <NotificationItem
                    key={id}
                    Icon={Icon}
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <Text weight={500}>
                            Portfolio{" "}
                            <Text weight={700} component="span" transform="uppercase">
                                {status}
                            </Text>{" "}
                            {message}
                            {status === "error" && (
                                <TextLink href="/docs/support" target="_blank">
                                    Please contact Support
                                </TextLink>
                            )}
                        </Text>
                    }
                />
            );
        }
        case "user_ex_acc.error": {
            const { error } = notification.data as UserExAccErrorNotification;
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon size="lg" variant="light" color="red">
                            <WalletOff />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <Text weight={500}>
                            Exchange Account{" "}
                            <Text weight={700} component="span">
                                ERROR
                            </Text>{" "}
                            {error}{" "}
                            <TextLink href="/docs/support" target="_blank">
                                Please contact Support
                            </TextLink>
                        </Text>
                    }
                />
            );
        }
        case "order.error": {
            const { error, orderId } = notification.data as OrderErrorNotification;
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon size="lg" variant="light" color="red">
                            <AlertCircle />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <Text weight={500}>
                            Order{" #"}
                            {orderId}{" "}
                            <Text weight={700} component="span">
                                ERROR
                            </Text>{" "}
                            {error && error.split("<html>")[0]}{" "}
                            <TextLink href="/docs/exchange-accounts" target="_blank">
                                Please check your API Keys
                            </TextLink>
                            {" or "}
                            <TextLink href="/docs/support" target="_blank">
                                contact Support
                            </TextLink>
                        </Text>
                    }
                />
            );
        }
        case "message.broadcast": {
            const { message } = notification.data as MessageBroadcastNotification;
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon size="lg" variant="light">
                            <InfoCircle />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <TypographyStylesProvider>
                            <div dangerouslySetInnerHTML={{ __html: message }} />
                        </TypographyStylesProvider>
                    }
                />
            );
        }
        case "message.support-reply": {
            const {
                data: { message }
            } = notification.data as SupportReplyNotification;
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon size="lg" variant="light">
                            <Help />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <Text weight={500}>
                            New Message from{" "}
                            <Text weight={700} component="span">
                                Support Team
                            </Text>{" "}
                            <TypographyStylesProvider>
                                <div dangerouslySetInnerHTML={{ __html: message }} />
                            </TypographyStylesProvider>
                        </Text>
                    }
                />
            );
        }
        case "user_sub.error": {
            const { error } = notification.data as UserSubErrorNotification;
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon size="lg" variant="light" color="red">
                            <AlertTriangle />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <Text weight={500}>
                            <Text weight={700} component="span">
                                ERROR
                            </Text>{" "}
                            occured while processing your payment {error}{" "}
                            <TextLink href="/docs/support" target="_blank">
                                Please contact Support
                            </TextLink>
                        </Text>
                    }
                />
            );
        }
        case "user_payment.status": {
            const { subscriptionName, status, code, context } = notification.data as UserPaymentStatusNotification;
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon size="lg" variant="light">
                            <CurrencyBitcoin />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <Text weight={500}>
                            Your charge{" "}
                            <Text weight={700} component="span">
                                {code}
                            </Text>{" "}
                            for subscription{" "}
                            <Text weight={700} component="span">
                                {subscriptionName}
                            </Text>{" "}
                            is{" "}
                            <Text weight={700} component="span" transform="uppercase">
                                {status}
                            </Text>{" "}
                            {context}
                        </Text>
                    }
                />
            );
        }
        case "user_sub.status": {
            const { subscriptionName, trialEnded, activeTo, status } = notification.data;
            let message;
            if (status === "expired" || status === "canceled") {
                message = (
                    <Text component="span" weight={500}>
                        Trading is{" "}
                        <Text weight={700} component="span">
                            stopping
                        </Text>{" "}
                        now! If there are any{" "}
                        <Text weight={700} component="span">
                            open positions
                        </Text>{" "}
                        they will be{" "}
                        <Text weight={700} component="span">
                            canceled
                        </Text>{" "}
                        (closed) with current market prices and potentially may cause profit{" "}
                        <Text weight={700} component="span">
                            losses
                        </Text>
                        !
                    </Text>
                );
            } else if (status === "expiring") {
                message = (
                    <Text component="span" weight={500}>
                        <Text weight={700} component="span">
                            {dayjs.utc().to(activeTo || trialEnded)}
                        </Text>{" "}
                        Please renew you subscription. nAfter subscription expires trading will be{" "}
                        <Text weight={700} component="span">
                            stopped
                        </Text>
                        ! If there are any{" "}
                        <Text weight={700} component="span">
                            open positions
                        </Text>{" "}
                        they will be{" "}
                        <Text weight={700} component="span">
                            canceled
                        </Text>{" "}
                        (closed) with current market prices and potentially may cause profit{" "}
                        <Text weight={700} component="span">
                            losses
                        </Text>
                        !
                    </Text>
                );
            }
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon size="lg" variant="light">
                            <Receipt2 />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <Text weight={500}>
                            Subscription{" "}
                            <Text weight={700} component="span">
                                {subscriptionName}
                            </Text>{" "}
                            is{" "}
                            <Text weight={700} component="span" transform="uppercase">
                                {status}
                            </Text>{" "}
                            {message}
                        </Text>
                    }
                />
            );
        }
        default:
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon size="lg" variant="light">
                            <Notification />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    readed={readed}
                    data={
                        <Group>
                            {Object.entries(data).map(([key, value]) => (
                                <Text key={key}>{`${key}: ${value}`}</Text>
                            ))}
                        </Group>
                    }
                />
            );
    }
}
