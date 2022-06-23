export interface UserExAcc {
    id: string;
    exchange: string;
    name: string;
    status: string;
    balance: number;
    balanceUpdatedAt: string;
    error?: string;
}
