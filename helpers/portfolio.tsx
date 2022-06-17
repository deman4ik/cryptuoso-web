import { PortfolioOptions, UserPortfolio } from "@cryptuoso/types";
import { Skeleton, ThemeIcon, Tooltip } from "@mantine/core";
import { Bolt, Coin, PresentationAnalytics, Scale, Trophy } from "tabler-icons-react";

export function getOptionDesc(option: keyof PortfolioOptions) {
    switch (option) {
        case "profit":
            return "Profit maximization";
        case "winRate":
            return "Maximizing the number of profitable trades";
        case "risk":
            return "Earnings with minimal risk";
        case "moneyManagement":
            return "Increase the ratio between the size of the win and the loss's size";
        case "efficiency":
            return "The return of an investment compared to it's risk";
        default:
            return "";
    }
}

export function getOptionName(option: keyof PortfolioOptions) {
    switch (option) {
        case "profit":
            return "Profit";
        case "winRate":
            return "Win Rate";
        case "risk":
            return "Risk";
        case "moneyManagement":
            return "Money Management";
        case "efficiency":
            return "Efficiency";
        default:
            return "";
    }
}

export function getOptionIcon(option: keyof PortfolioOptions) {
    switch (option) {
        case "profit":
            return <Coin size={20} />;
        case "winRate":
            return <Trophy size={20} />;
        case "risk":
            return <Bolt size={20} />;
        case "moneyManagement":
            return <Scale size={20} />;
        case "efficiency":
            return <PresentationAnalytics size={20} />;
        default:
            return "";
    }
}

export function getPortfolioOptionsIcons(options?: PortfolioOptions, sort: "key" | "value" = "key") {
    const optionRows = options ? (
        Object.entries(options)
            .sort(sort === "key" ? ([, value]) => (value ? -1 : 1) : ([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => {
                return (
                    <Tooltip
                        key={key}
                        transition="fade"
                        transitionDuration={500}
                        transitionTimingFunction="ease"
                        label={
                            <span style={{ whiteSpace: "pre-line" }}>{`${getOptionName(key as keyof PortfolioOptions)}${
                                value ? " ✅" : " ❌"
                            }\n${getOptionDesc(key as keyof PortfolioOptions)}`}</span>
                        }
                    >
                        <ThemeIcon size="md" variant="light" color={value ? "indigo" : "gray"}>
                            {getOptionIcon(key as keyof PortfolioOptions)}
                        </ThemeIcon>
                    </Tooltip>
                );
            })
    ) : (
        <Skeleton height={30} />
    );
    return optionRows;
}

export function isPortfolioStarted(status?: UserPortfolio["status"]) {
    if (status === "started" || status === "starting") return true;
    return false;
}
