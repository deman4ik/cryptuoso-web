import { DefaultMantineColor } from "@mantine/core";
import { Briefcase, LockAccess, ReceiptTax, SettingsAutomation } from "tabler-icons-react";
import { UserPayment, UserSub } from "@cryptuoso/types";

export const paidFeatures = [
    {
        icon: SettingsAutomation,
        title: "Automated",
        description: "Fully automated trading on a pool of 200+ robots. Start and forget.",
        fromColor: "indigo",
        toColor: "cyan"
    }
];

export const features = [
    {
        icon: LockAccess,
        title: "No Limits",
        description: "Unlimited positions & deals. Unlimited trading volume.",
        fromColor: "red",
        toColor: "pink"
    },
    {
        icon: ReceiptTax,
        title: "No fees",
        description: "No additional fees on your trades. Fixed subscription pricing.",
        fromColor: "lime",
        toColor: "cyan"
    },
    {
        icon: Briefcase,
        title: "Portfolio",
        description: "Automated portfolio rebalancing and performance analysis.",
        fromColor: "pink",
        toColor: "grape"
    }
];

export interface Option {
    code: string;
    name: string;
    priceMonth: number;
    priceTotal: number;
    discount: number | null;
    highlight: boolean;
    subscriptionId?: string;
}

export const freeOption: Option = {
    code: "free",
    name: "Free Plan",
    priceMonth: 0,
    priceTotal: 0,
    discount: null,
    highlight: false
};

export function getPaymentStatusColor(status: UserPayment["status"]): DefaultMantineColor {
    switch (status) {
        case "NEW":
        case "PENDING":
        case "UNRESOLVED":
            return "blue";
        case "COMPLETED":
        case "RESOLVED":
            return "green";
        case "EXPIRED":
        case "CANCELED":
            return "red";
        default:
            return "gray";
    }
}

export function getSubStatusColor(status?: UserSub["status"]): DefaultMantineColor {
    switch (status) {
        case "pending":
            return "blue";
        case "expiring":
            return "yellow";
        case "active":
        case "trial":
            return "green";
        case "expired":
        case "canceled":
            return "red";
        default:
            return "gray";
    }
}
