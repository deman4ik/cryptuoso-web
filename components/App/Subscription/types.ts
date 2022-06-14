import { UnitType } from "dayjs";

export interface IUserSub {
    id: string;
    userId: string;
    status: "active" | "trial" | "expired" | "pending" | "canceled" | "expiring";
    trialStarted?: string;
    trialEnded?: string;
    activeFrom?: string;
    activeTo?: string;
    subscription: {
        id: string;
        name: string;
        description?: string;
    };
    subscriptionOption: {
        code: "1m" | "6m" | "1y";
        name: string;
        priceTotal: number;
    };
    userPayments?: IUserPayment[];
}

export interface IUserPayment {
    id: string;
    code: string;
    url?: string;
    status: "NEW" | "PENDING" | "COMPLETED" | "UNRESOLVED" | "RESOLVED" | "EXPIRED" | "CANCELED";
    price: number;
    createdAt: string;
    expiresAt?: string;
    subscriptionFrom?: string;
    subscriptionTo?: string;
    userSubId?: string;
    userSub?: {
        subscriptionOption: {
            name: string;
            priceTotal?: number;
        };
        subscription: {
            name: string;
        };
    };
}

export interface ISubscription {
    id: string;
    name: string;
    description?: string;
    trialAvailable?: boolean;
    options: {
        code: "1m" | "6m" | "1y";
        name: string;
        sortOrder: number;
        unit: UnitType;
        amount: number;
        priceMonth: number;
        priceTotal: number;
        discount?: number;
        freeMonths?: number;
        highlight: boolean;
    }[];
}
