import { gql } from "urql";

export const ExchangeAccountQuery = gql`
    query ExchangeAccount($userId: uuid!) {
        userExAcc: user_exchange_accs(where: { user_id: { _eq: $userId } }, limit: 1, order_by: { created_at: desc }) {
            id
            exchange
            status
            balance: balances(path: "$.totalUSD")
            balanceUpdatedAt: balances(path: "$.updatedAt")
            error
        }
    }
`;

export const portfoliosQuery = gql`
    query PublicPortfolios(
        $exchange: String!
        $risk: Boolean!
        $profit: Boolean!
        $winRate: Boolean!
        $efficiency: Boolean!
        $moneyManagement: Boolean!
    ) {
        portfolios: v_portfolios(
            where: {
                exchange: { _eq: $exchange }
                option_risk: { _eq: $risk }
                option_profit: { _eq: $profit }
                option_win_rate: { _eq: $winRate }
                option_efficiency: { _eq: $efficiency }
                option_money_management: { _eq: $moneyManagement }
                status: { _eq: "started" }
                base: { _eq: true }
            }
            limit: 1
        ) {
            stats {
                tradesCount: trades_count
                currentBalance: current_balance
                initialBalance: initial_balance
                netProfit: net_profit
                percentNetProfit: percent_net_profit
                winRate: win_rate
                maxDrawdown: max_drawdown
                maxDrawdownDate: max_drawdown_date
                percentMaxDrawdown: percent_max_drawdown
                payoffRatio: payoff_ratio
                sharpeRatio: sharpe_ratio
                recoveryFactor: recovery_factor
                avgTradesCount: avg_trades_count_years
                avgPercentNetProfitYearly: avg_percent_net_profit_yearly
                equity: equity
                firstPosition: first_position
                lastPosition: last_position
            }
        }
    }
`;

export const portfoliosWithPositionsQuery = gql`
    query PublicPortfolios(
        $exchange: String!
        $risk: Boolean!
        $profit: Boolean!
        $winRate: Boolean!
        $efficiency: Boolean!
        $moneyManagement: Boolean!
    ) {
        portfolios: v_portfolios(
            where: {
                exchange: { _eq: $exchange }
                option_risk: { _eq: $risk }
                option_profit: { _eq: $profit }
                option_win_rate: { _eq: $winRate }
                option_efficiency: { _eq: $efficiency }
                option_money_management: { _eq: $moneyManagement }
                status: { _eq: "started" }
                base: { _eq: true }
            }
            limit: 1
        ) {
            stats {
                tradesCount: trades_count
                currentBalance: current_balance
                initialBalance: initial_balance
                netProfit: net_profit
                percentNetProfit: percent_net_profit
                winRate: win_rate
                maxDrawdown: max_drawdown
                maxDrawdownDate: max_drawdown_date
                percentMaxDrawdown: percent_max_drawdown
                payoffRatio: payoff_ratio
                sharpeRatio: sharpe_ratio
                recoveryFactor: recovery_factor
                avgTradesCount: avg_trades_count_years
                avgPercentNetProfitYearly: avg_percent_net_profit_yearly
                equity: equity
                firstPosition: first_position
                lastPosition: last_position
            }
            closedPositions: positions(
                where: { status: { _in: ["closed"] } }
                order_by: { exit_date: desc_nulls_last }
                limit: 20
            ) {
                id
                direction
                status
                robot {
                    asset
                }
                entryAction: entry_action
                entryPrice: entry_price
                entryDate: entry_date
                exitAction: exit_action
                exitPrice: exit_price
                exitDate: exit_date
                barsHeld: bars_held
                volume
                profit
            }
        }
    }
`;

export const UserPortfolioQuery = gql`
    query UserPortfolio($userId: uuid!) {
        userPortfolio: v_user_portfolios(where: { user_id: { _eq: $userId } }) {
            id
            userExAccId: user_ex_acc_id
            exchange
            status
            message
            startedAt: started_at
            stoppedAt: stopped_at
            activeFrom: active_from
            settings: user_portfolio_settings
            nextSettings: next_user_portfolio_settings
        }
    }
`;

export const UserPositionsQuery = gql`
    query UserPortfolioPositions($userId: uuid!) {
        userPortfolio: v_user_portfolios(where: { user_id: { _eq: $userId } }) {
            openPositions: positions(where: { status: { _eq: "open" } }, order_by: { entry_date: desc_nulls_last }) {
                id
                direction
                status
                asset
                entryAction: entry_action
                entryPrice: entry_price
                entryDate: entry_date
                volume: entry_executed
                profit
            }
            closedPositions: positions(
                where: { status: { _in: ["closed", "closedAuto"] } }
                order_by: { exit_date: desc_nulls_last }
                limit: 20
            ) {
                id
                direction
                status
                asset
                entryAction: entry_action
                entryPrice: entry_price
                entryDate: entry_date
                exitAction: exit_action
                exitPrice: exit_price
                exitDate: exit_date
                barsHeld: bars_held
                volume: exit_executed
                profit
            }
        }
    }
`;

export const UserExAccAndPortfolioQuery = gql`
    query UserExAccAndPortfolio($userId: uuid!) {
        userExAcc: user_exchange_accs(where: { user_id: { _eq: $userId } }, limit: 1, order_by: { created_at: desc }) {
            id
            exchange
            status
            balance: balances(path: "$.totalUSD")
            balanceUpdatedAt: balances(path: "$.updatedAt")
            error
        }
        userPortfolio: v_user_portfolios(where: { user_id: { _eq: $userId } }) {
            id
            userExAccId: user_ex_acc_id
            exchange
            status
            message
            startedAt: started_at
            stoppedAt: stopped_at
            activeFrom: active_from
            settings: user_portfolio_settings
            nextSettings: next_user_portfolio_settings
        }
    }
`;

export const ExchangesQuery = gql`
    query Exchanges {
        exchanges {
            code
            name
        }
    }
`;
