import React, { ReactNode } from "react";
import { AppShell, Container, createStyles } from "@mantine/core";
import { LandingHeader } from "@cryptuoso/components/Landing/Layout/Header";
import { LandingFooter } from "@cryptuoso/components/Landing/Layout/Footer";

export const headerLinks = [
    {
        link: "/#features",
        label: "FEATURES"
    },
    {
        link: "/#pricing",
        label: "PRICING"
    },
    {
        link: "/#faq",
        label: "FAQ"
    }
];

export const footerLinks = [
    ...headerLinks,
    {
        link: "/terms",
        label: "TERMS"
    },
    {
        link: "/privacy",
        label: "PRIVACY"
    },
    {
        link: "/support",
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

export function Layout({ children }: { children: ReactNode }) {
    const { classes } = useStyles();
    return (
        <div className={classes.root}>
            <AppShell header={<LandingHeader links={headerLinks} />}>
                <Container size="xl" mt={60} mb={20}>
                    {children}
                </Container>
            </AppShell>
            <LandingFooter links={footerLinks} />
        </div>
    );
}
