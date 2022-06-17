export const enum ValidTimeframe {
    "1m" = 1,
    "5m" = 5,
    "15m" = 15,
    "30m" = 30,
    "1h" = 60,
    "2h" = 120,
    "4h" = 240,
    "8h" = 480,
    "12h" = 720,
    "1d" = 1440
}

export type PositionDirection = "long" | "short";

export const enum RobotPositionStatus {
    new = "new",
    open = "open",
    closed = "closed"
}

export const enum RobotTradeStatus {
    new = "new",
    open = "open",
    closed = "closed"
}

export const enum OrderType {
    stop = "stop",
    limit = "limit",
    market = "market",
    forceMarket = "forceMarket"
}

export const enum OrderDirection {
    buy = "buy",
    sell = "sell"
}

export const enum OrderStatus {
    new = "new",
    open = "open",
    closed = "closed",
    canceled = "canceled"
}

export const enum TradeAction {
    long = "long",
    short = "short",
    closeLong = "closeLong",
    closeShort = "closeShort"
}

export interface BasePosition {
    id?: string;
    robotId?: string;
    timeframe?: ValidTimeframe;
    prefix?: string;
    code?: string;
    parentId?: string;
    direction?: PositionDirection;
    status?: RobotPositionStatus;
    entryStatus?: RobotTradeStatus;
    entryPrice?: number;
    entryDate?: string;
    entryOrderType?: OrderType;
    entryAction?: TradeAction;
    entryCandleTimestamp?: string;
    exitStatus?: RobotTradeStatus;
    exitPrice?: number;
    exitDate?: string;
    exitOrderType?: OrderType;
    exitAction?: TradeAction;
    exitCandleTimestamp?: string;
    amountInCurrency?: number;
    volume?: number;
    worstProfit?: number;
    maxPrice?: number;
    profit?: number;
    barsHeld?: number;
    fee?: number;
    margin?: number;
    emulated?: boolean;
    meta?: {
        portfolioShare?: number;
        currentBalance?: number;
        prevBalance?: number;
    };
    minAmountCurrency?: number;
}