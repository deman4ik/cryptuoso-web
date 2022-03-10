import React, { ReactNode } from "react";
import { AppShell, Container } from "@mantine/core";
import { LandingHeader } from "../Header/LandingHeader";

export function Layout({ children }: { children: ReactNode }) {
    return (
        <AppShell header={<LandingHeader />}>
            <Container size="xl" sx={{ marginTop: "60px" }}>
                {children}
            </Container>
        </AppShell>
    );
}
