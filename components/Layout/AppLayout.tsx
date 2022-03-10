import React, { ReactNode } from "react";
import { Container } from "@mantine/core";

export function Layout({ children }: { children: ReactNode }) {
    return <Container>{children}</Container>;
}
