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
    Container,
    Group,
    Button,
    HeaderProps,
    ContainerProps
} from "@mantine/core";
import { Logo } from "@cryptuoso/components/Images/Logo";
import { SimpleLink } from "@cryptuoso/components/Link/SimpleLink";
import { TextLink } from "@cryptuoso/components/Link/TextLink";
import { ColorSchemeToggle } from "@cryptuoso/components/Button/ColorSchemeToggle";

const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%"
    },

    burger: {
        [theme.fn.largerThan("sm")]: {
            display: "none"
        }
    }
}));

export function AppHeader({
    opened,
    setOpened,
    ...other
}: {
    opened: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { classes } = useStyles();

    return (
        <div className={classes.header}>
            <Group className={classes.header} position="apart" spacing={12}>
                <Burger opened={opened} onClick={() => setOpened((o) => !o)} size="sm" className={classes.burger} />
                <SimpleLink href="/app">
                    <Logo />
                </SimpleLink>
                <TextLink transform="uppercase" weight={700} size="lg" href="/app">
                    Cryptuoso
                </TextLink>
            </Group>
            <Group spacing={12}>
                <Button>Action</Button>
                <ColorSchemeToggle />
            </Group>
        </div>
    );
}
