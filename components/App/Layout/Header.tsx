import React from "react";
import { Text, Burger, createStyles, Group, Button } from "@mantine/core";
import { Logo } from "@cryptuoso/components/Image";
import { SimpleLink } from "@cryptuoso/components/Link";

const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    burger: {
        [theme.fn.largerThan("md")]: {
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
                <SimpleLink href="/app" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Logo />
                </SimpleLink>
                <Text component={SimpleLink} transform="uppercase" weight={700} size="lg" href="/app">
                    Cryptuoso
                </Text>
            </Group>
        </div>
    );
}
