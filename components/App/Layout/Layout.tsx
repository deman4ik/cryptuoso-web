import React, { ReactNode, useState } from "react";
import {
    Header,
    Navbar,
    useMantineTheme,
    Text,
    MediaQuery,
    Burger,
    AppShell,
    createStyles,
    Container
} from "@mantine/core";
import { AppNavbar } from "./Navbar";
import { AppHeader } from "./Header";
import { BorderBottom } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
    shell: {
        position: "relative"
    },
    header: {
        borderBottom: "1px solid transparent",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));

export function Layout({ children, title }: { children: ReactNode; title: string }) {
    const [opened, setOpened] = useState(false);

    const { classes } = useStyles();
    /* return (
        <AppShell
            // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
            navbarOffsetBreakpoint="sm"
            // prop on AppShell will be automatically added to Header and Navbar
            fixed
            navbar={<AppNavbar hidden={!opened} />}
            header={<AppHeader opened={opened} setOpened={setOpened} />}
            styles={(theme) => ({
                main: { marginLeft: 300 }
            })}
        >
            {children}
        </AppShell>
    );*/

    return (
        <AppShell
            // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
            navbarOffsetBreakpoint="md"
            // fixed prop on AppShell will be automatically added to Header and Navbar
            fixed
            navbar={
                <AppNavbar
                    hidden={!opened}
                    hiddenBreakpoint="md"
                    width={{ sm: 250 }}
                    p="md"
                    position={{ top: 0, left: 0 }}
                />
            }
            header={
                <Header height={60} p="md" className={classes.header}>
                    <AppHeader opened={opened} setOpened={setOpened} />
                </Header>
            }
            className={classes.shell}
        >
            {children}
        </AppShell>
    );
}
