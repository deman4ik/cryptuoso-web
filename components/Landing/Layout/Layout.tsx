import React, { ReactNode } from "react";
import { AppShell, Container, createStyles, MantineNumberSize } from "@mantine/core";
import { LandingHeader, LandingFooter } from "@cryptuoso/components/Landing/Layout";

export const headerLinks = [
    {
        link: "/#features",
        label: "FEATURES"
    },
    {
        link: "/portfolios",
        label: "PORTFOLIOS"
    },
    {
        link: "/#pricing",
        label: "PRICING"
    },
    {
        link: "/#faq",
        label: "FAQ"
    },
    {
        link: "/docs/getting-started",
        label: "DOCS"
    }
];

export const footerLinks = [
    ...headerLinks,
    {
        link: "/info/terms",
        label: "TERMS"
    },
    {
        link: "/info/privacy",
        label: "PRIVACY"
    },
    {
        link: "/docs/support",
        label: "SUPPORT"
    }
];

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh"
    }
}));

export function Layout({ children, containerSize }: { children: ReactNode; containerSize?: MantineNumberSize }) {
    const { classes } = useStyles();
    return (
        <div className={classes.root}>
            <AppShell header={<LandingHeader links={headerLinks} />}>
                <Container size={containerSize || "lg"} mb={20} px={0}>
                    {children}
                </Container>
            </AppShell>
            <LandingFooter links={footerLinks} />
        </div>
    );
}
