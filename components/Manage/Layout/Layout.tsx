import React, { ReactNode, useState } from "react";
import { Header, AppShell, createStyles } from "@mantine/core";
import { AppNavbar } from "./Navbar";
import { AppHeader } from "./Header";
import { FilterContext } from "./types";

const useStyles = createStyles((theme) => ({
    shell: {
        position: "relative"
    },
    header: {
        borderBottom: "1px solid transparent",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));
export const FiltersContext = React.createContext<FilterContext>({
    dates: {
        dateFrom: null,
        dateTo: null,
        period: "1d"
    },
    setDates: () => {},
    refreshRate: "off",
    setRefreshRate: () => {}
});

export function Layout({ children }: { children: ReactNode }) {
    const [opened, setOpened] = useState(false);
    const [dates, setDates] = useState<FilterContext["dates"]>({
        dateFrom: null,
        dateTo: null,
        period: "1d"
    });
    const [refreshRate, setRefreshRate] = useState<FilterContext["refreshRate"]>("off");
    const { classes } = useStyles();

    return (
        <FiltersContext.Provider value={{ dates, setDates, refreshRate, setRefreshRate }}>
            <AppShell
                navbarOffsetBreakpoint="md"
                fixed
                padding="xs"
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
        </FiltersContext.Provider>
    );
}
