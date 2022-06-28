import { UserPortfolio } from "./portfolio";
import { UserPayment, UserSub } from "./subscription";
import { OrderStatus, OrderType, PositionDirection, PositionStatus, TradeAction } from "./trade";

export interface UserNotification<T> {
    id: string;
    timestamp: string;
    type:
        | "user.trade"
        | "signal_sub.trade"
        | "user_portfolio.builded"
        | "user_portfolio.build_error"
        | "user_portfolio.status"
        | "user_ex_acc.error"
        | "user-robot.error"
        | "order.error"
        | "message.broadcast"
        | "message.support-reply"
        | "user_sub.error"
        | "user_payment.status"
        | "user_sub.status";
    data: T;
    readed: boolean;
}

export interface UserTradeNotification {
    id: string;
    code: string;
    exchange: string;
    asset: string;
    currency: string;
    robotCode: string;
    userRobotId: string;
    positionId?: string;
    userPositionId: string;
    userPortfolioId?: string;
    userId: string;
    status: PositionStatus;
    entryAction?: TradeAction;
    entryStatus?: OrderStatus;
    entrySignalPrice?: number;
    entryPrice?: number;
    entryDate?: string;
    entryCandleTimestamp?: string;
    entryExecuted?: number;
    exitAction?: TradeAction;
    exitStatus?: OrderStatus;
    exitPrice?: number;
    exitDate?: string;
    exitCandleTimestamp?: string;
    exitExecuted?: number;
    reason?: string;
    profit?: number;
    barsHeld?: number;
}

export interface SignalSubTradeNotification {
    id: string;
    signalSubscriptionId: string;
    subscriptionRobotId: string;
    robotId: string;
    robotCode: string;
    exchange: string;
    asset: string;
    currency: string;
    direction: PositionDirection;
    entryPrice: number;
    entryDate: string;
    entryAction: TradeAction;
    entryOrderType: OrderType;
    entryBalance: number;
    exitPrice?: number;
    exitDate?: string;
    exitAction?: TradeAction;
    exitOrderType?: OrderType;
    leverage?: number;
    volume?: number;
    status?: "open" | "canceled" | "closed" | "closedAuto";
    profit?: number;
    profitPercent?: number;
    providerPositionId?: string;
    share?: number;
    error?: string;
}

export interface UserPortfolioBuildedNotification {
    userPortfolioId: string;
}

export interface UserPortfolioBuildErrorNotification {
    userPortfolioId: string;
    error: string;
}

export interface UserPortfolioStatusNotification {
    userPortfolioId: string;
    timestamp: string;
    status: UserPortfolio["status"];
    message?: string;
}

export interface UserExAccErrorNotification {
    userExAccId: string;
    timestamp: string;
    error: string;
}

export interface UserRobotErrorNotification {
    userRobotId: string;
    robotCode: string;
    error: string;
}

export interface OrderErrorNotification {
    orderId: string;
    timestamp: string;
    userExAccId: string;
    userRobotId: string;
    userPositionId: string;
    positionId?: string;
    status: OrderStatus;
    error: string;
    robotCode: string;
}

export interface MessageBroadcastNotification {
    message: string;
}

export interface SupportReplyNotification {
    data: {
        message: string;
    };
}

export interface UserSubErrorNotification {
    userSubId: string;
    userId: string;
    error: string;
    timestamp: string;
    subscriptionName: string;
    subscriptionOptionName: string;
    userPayment?: UserPayment;
}

export interface UserPaymentStatusNotification {
    userSubId: string;
    userId: string;
    userPaymentId: string;
    code: string;
    status: UserPayment["status"];
    context?: string;
    price?: number;
    timestamp: string;
    subscriptionName: string;
    subscriptionOptionName: string;
}

export interface UserSubStatusNotification {
    userSubId: string;
    userId: string;
    status: UserSub["status"];
    context?: string;
    subscriptionName: string;
    subscriptionOptionName: string;
    timestamp: string;
    activeTo?: string;
    trialEnded?: string;
}
