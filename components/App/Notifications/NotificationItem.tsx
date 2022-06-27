import { CoinIcon } from "@cryptuoso/components/Image";
import { plusNum } from "@cryptuoso/helpers";
import dayjs from "@cryptuoso/libs/dayjs";
import {
    PositionStatus,
    UserNotification,
    UserPortfolioStatusNotification,
    UserTradeNotification
} from "@cryptuoso/types";
import { Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { ReactNode } from "react";
import {
    AlertTriangle,
    ChartCandle,
    Check,
    Urgent,
    Notification,
    PlayerPlay,
    PlayerPause,
    PlayerRecord,
    AlertOctagon,
    AlertCircle,
    InfoCircle,
    Help,
    Receipt2,
    WalletOff,
    CurrencyBitcoin
} from "tabler-icons-react";
import { Icon as TablerIcon } from "tabler-icons-react";

export function NotificationItem({ Icon, timestamp, data }: { Icon?: ReactNode; timestamp: string; data: ReactNode }) {
    return (
        <Paper shadow="xs" p="md">
            <Stack spacing={5}>
                <Group>
                    {Icon}
                    {data}
                </Group>
                <Text size="xs" color="dimmed">
                    {dayjs.utc().to(dayjs.utc(timestamp))}
                </Text>
            </Stack>
        </Paper>
    );
}

export function NotificationComponent({ notification }: { notification: UserNotification<any> }) {
    const { id, type, timestamp, data } = notification;
    switch (type) {
        case "user.trade": {
            const { status, asset, entryPrice, exitPrice, entryExecuted, exitExecuted, profit } =
                notification.data as UserTradeNotification;

            let data;
            if (status === PositionStatus.open)
                data = (
                    <Text weight={500}>
                        New entry trade{" "}
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
                        New exit trade{" "}
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
                    data={data}
                />
            );
        }

        case "signal_sub.trade":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <Urgent />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        case "user_portfolio.builded":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <Check />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        case "user_portfolio.build_error":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <AlertTriangle />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        case "user_portfolio.status": {
            const status = (data as UserPortfolioStatusNotification).status;
            const icon = status === "started" ? PlayerPlay : PlayerPause;

            return (
                <NotificationItem
                    key={id}
                    Icon={<ThemeIcon variant="outline">{icon}</ThemeIcon>}
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        }
        case "user_ex_acc.error":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <WalletOff />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        case "user-robot.error":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <AlertCircle />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        case "order.error":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <AlertCircle />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        case "message.broadcast":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <InfoCircle />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        case "message.support-reply":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <Help />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        case "user_sub.error":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <AlertTriangle />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        case "user_payment.status":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <CurrencyBitcoin />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        case "user_sub.status":
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <Receipt2 />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={<Text>{id}</Text>}
                />
            );
        default:
            return (
                <NotificationItem
                    key={id}
                    Icon={
                        <ThemeIcon variant="outline">
                            <Notification />
                        </ThemeIcon>
                    }
                    timestamp={timestamp}
                    data={
                        <Group>
                            {Object.entries(data).map(([key, value]) => (
                                <Text key={key}>
                                    {key}: {value}
                                </Text>
                            ))}
                        </Group>
                    }
                />
            );
    }
}
