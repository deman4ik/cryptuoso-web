import React from "react";
import { createStyles, Container, Text, Button, Group } from "@mantine/core";
import { SimpleLink } from "@cryptuoso/components/Link";

const BREAKPOINT = "@media (max-width: 755px)";

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: "relative",
        boxSizing: "border-box"
    },

    inner: {
        position: "relative",
        paddingTop: 200,
        paddingBottom: 120,

        [BREAKPOINT]: {
            paddingBottom: 80,
            paddingTop: 80
        }
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: 62,
        fontWeight: 900,
        lineHeight: 1.1,
        margin: 0,
        padding: 0,
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [BREAKPOINT]: {
            fontSize: 42,
            lineHeight: 1.2
        }
    },

    description: {
        marginTop: theme.spacing.xl,
        fontSize: 24,

        [BREAKPOINT]: {
            fontSize: 18
        }
    },

    controls: {
        marginTop: theme.spacing.xl * 2,

        [BREAKPOINT]: {
            marginTop: theme.spacing.xl
        }
    },

    control: {
        height: 54,
        paddingLeft: 38,
        paddingRight: 38,

        [BREAKPOINT]: {
            height: 54,
            paddingLeft: 18,
            paddingRight: 18,
            flex: 1
        }
    }
}));

export function Hero() {
    const { classes } = useStyles();

    return (
        <div className={classes.wrapper}>
            <Container size={700} className={classes.inner}>
                <h1 className={classes.title}>
                    <Text
                        component="span"
                        variant="gradient"
                        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                        inherit
                    >
                        CRYPTUOSO
                    </Text>{" "}
                    Cryptocurrency Trading Automation Bot
                </h1>

                <Text className={classes.description} color="dimmed">
                    Just invest – robots do the rest
                </Text>

                <Group className={classes.controls}>
                    <Button
                        component={SimpleLink}
                        href="/app"
                        size="xl"
                        className={classes.control}
                        variant="gradient"
                        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                    >
                        Get started on Web
                    </Button>
                    <Button
                        component={SimpleLink}
                        href="https://t.me/cryptuoso_bot"
                        size="xl"
                        className={classes.control}
                        variant="gradient"
                        gradient={{ from: "indigo", to: "blue", deg: 45 }}
                    >
                        or with Telegram
                    </Button>
                </Group>
            </Container>
        </div>
    );
}
