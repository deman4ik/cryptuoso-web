export interface GenericObject<T> {
    [key: string]: T;
}

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

export type StatsPeriod = "month" | "quarter" | "year";

export type PerformanceVals = { x: number; y: number }[];

export interface BaseStats {
    initialBalance: number | null;
    currentBalance: number | null;
    tradesCount: number;
    tradesWinning: number;
    tradesLosing: number;
    winRate: number;
    lossRate: number;
    netProfit: number;
    avgNetProfit: number | null;
    percentNetProfit: number | null;
    localMax: number;
    peakBalance: number;
    grossProfit: number;
    grossLoss: number;
    avgGrossProfit: number | null;
    avgGrossLoss: number | null;
    percentGrossProfit: number | null;
    percentGrossLoss: number | null;
    maxDrawdown: number;
    percentMaxDrawdown: number | null;
    percentMaxDrawdownDate: string | null;
    maxDrawdownDate: string | null;
    profitFactor: number | null;
    recoveryFactor: number | null;
    payoffRatio: number | null;
    lastUpdatedAt: string | null;
    firstPosition: BasePosition | null;
    lastPosition: BasePosition | null;
}

export interface BasePeriodStats {
    initialBalance: BaseStats["initialBalance"];
    currentBalance: BaseStats["currentBalance"];
    tradesCount: BaseStats["tradesCount"];
    percentNetProfit: BaseStats["percentNetProfit"];
    percentGrossProfit: BaseStats["percentGrossProfit"];
    percentGrossLoss: BaseStats["percentGrossLoss"];
    percentMaxDrawdown?: BaseStats["percentMaxDrawdown"];
    winRate?: BaseStats["winRate"];
    payoffRatio?: BaseStats["payoffRatio"];
    netProfit?: BaseStats["netProfit"];
}

export interface Stats extends BaseStats {
    initialBalance: number | null;
    currentBalance: number | null;
    tradesCount: number;
    tradesWinning: number;
    tradesLosing: number;
    winRate: number;
    lossRate: number;
    sumBarsHeld: number | null;
    avgBarsHeld: number | null;
    sumBarsHeldWinning: number | null;
    avgBarsHeldWinning: number | null;
    sumBarsHeldLosing: number | null;
    avgBarsHeldLosing: number | null;
    netProfit: number;
    avgNetProfit: number | null;
    // positionsProfitPercents: number[];
    percentNetProfit: number | null;
    // sumPercentNetProfit: number | null;
    // avgPercentNetProfit: number | null;
    // sumPercentNetProfitSqDiff: number | null;
    netProfitsSMA: number[];
    netProfitSMA: number | null;
    stdDevPercentNetProfit: number | null;
    localMax: number;
    grossProfit: number;
    grossLoss: number;
    avgGrossProfit: number | null;
    avgGrossLoss: number | null;
    percentGrossProfit: number | null;
    percentGrossLoss: number | null;
    currentWinSequence: number;
    currentLossSequence: number;
    maxConsecWins: number;
    maxConsecLosses: number;
    maxDrawdown: number;
    percentMaxDrawdown: number | null;
    percentMaxDrawdownDate: string | null;
    amountProportion: number | null;
    maxDrawdownDate: string | null;
    profitFactor: number | null;
    recoveryFactor: number | null;
    payoffRatio: number | null;
    sharpeRatio: number | null;
    rating: number | null;
    lastUpdatedAt: string | null;
    firstPosition: BasePosition | null;
    lastPosition: BasePosition | null;
    equity: PerformanceVals;
    equityAvg: PerformanceVals;
    seriesCount: number;
    currentSeries: number | null;
}

export interface FullStats extends Stats {
    avgTradesCountYears: number | null;
    avgTradesCountQuarters: number | null;
    avgTradesCountMonths: number | null;
    avgPercentNetProfitYears: number | null;
    avgPercentNetProfitQuarters: number | null;
    avgPercentNetProfitMonths: number | null;
    avgPercentGrossProfitYears: number | null;
    avgPercentGrossProfitQuarters: number | null;
    avgPercentGrossProfitMonths: number | null;
    avgPercentGrossLossYears: number | null;
    avgPercentGrossLossQuarters: number | null;
    avgPercentGrossLossMonths: number | null;
    avgPercentNetProfitYearly: number | null;
    avgPercentMaxDrawdownYearly: number | null;
    avgPayoffRatioYearly: number | null;
    avgWinRateYearly: number | null;
    avgTradesCountYearly: number | null;
    emulateNextPosition: boolean | null;
    marginNextPosition: number | null;
    zScore: number | null;
    maxLeverage: number | null;
    periodStats: {
        year: GenericObject<PeriodStats<BasePeriodStats>>;
        quarter: GenericObject<PeriodStats<BasePeriodStats>>;
        month: GenericObject<PeriodStats<BasePeriodStats>>;
    };
}

export interface PeriodStats<T> {
    period: StatsPeriod;
    year: number;
    quarter?: number | null;
    month?: number | null;
    dateFrom: string;
    dateTo: string;
    stats: T;
}

export interface StatsInfo {
    tradesCount: FullStats["tradesCount"];
    currentBalance: FullStats["currentBalance"];
    netProfit: FullStats["netProfit"];
    percentNetProfit: FullStats["percentNetProfit"];
    winRate: FullStats["winRate"];
    maxDrawdown: FullStats["maxDrawdown"];
    maxDrawdownDate: FullStats["maxDrawdownDate"];
    percentMaxDrawdown: FullStats["percentMaxDrawdown"];
    payoffRatio: FullStats["payoffRatio"];
    sharpeRatio: FullStats["sharpeRatio"];
    recoveryFactor: FullStats["recoveryFactor"];
    avgTradesCount: FullStats["avgTradesCountYears"];
    avgPercentNetProfitYearly: FullStats["avgPercentNetProfitYearly"];
    equity: FullStats["equity"];
    firstPosition: BasePosition;
    lastPosition: BasePosition;
}
