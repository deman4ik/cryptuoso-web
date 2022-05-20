import { StatsInfo } from "@cryptuoso/components/Stats";

export interface UserPortfolio {
    id: string;
    userId: string;
    userExAccId?: string;
    exchange: string;
    allocation: "shared" | "dedicated";
    status: "starting" | "started" | "stopping" | "stopped" | "error" | "buildError";
    startedAt?: string;
    stoppedAt?: string;
    message?: string;
    stats: StatsInfo;
    settings: PortfolioSettings;
    nextSettings?: PortfolioSettings;
}

export interface PortfolioOptions {
    // diversification: boolean;
    profit: boolean;
    risk: boolean;
    moneyManagement: boolean;
    winRate: boolean;
    efficiency: boolean;
}

export interface PortfolioSettings {
    options: PortfolioOptions;
    tradingAmountType?: "currencyFixed" | "balancePercent";
    balancePercent?: number;
    tradingAmountCurrency?: number;
    initialBalance: number;
    leverage: number;
}
