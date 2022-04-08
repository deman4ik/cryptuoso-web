import React from "react";
import { createStyles, Image, Container, Title, Button, Group, Text, List, ThemeIcon, Grid, Box } from "@mantine/core";
import { Check } from "tabler-icons-react";
import { SimpleLink } from "@cryptuoso/components/Link/SimpleLink";
//import Image from "next/image";

const useStyles = createStyles((theme) => ({
    wrapper: {
        paddingTop: theme.spacing.xl * 2,
        paddingBottom: theme.spacing.xl * 2
        // minHeight: 650
    },

    inner: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: theme.spacing.xl * 2,
        paddingBottom: theme.spacing.xl * 2
    },

    content: {
        //  maxWidth: 480,
        //  marginRight: theme.spacing.xl * 3,

        [theme.fn.smallerThan("md")]: {
            maxWidth: "100%"
            // marginRight: 0
        }
    },

    title: {
        fontWeight: 900,
        marginBottom: theme.spacing.xl * 1.5
    },

    control: {
        [theme.fn.smallerThan("sm")]: {
            flex: 1,
            width: "100%"
        }
    },

    imageWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto"
    },
    image: {
        width: 300
    },

    highlight: {
        position: "relative",
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)
                : theme.colors[theme.primaryColor][0],
        borderRadius: theme.radius.sm,
        marginLeft: theme.spacing.sm,
        marginRight: theme.spacing.sm,
        padding: "0px 8px"
    }
}));

export function TelegramBot() {
    const { classes } = useStyles();
    return (
        <Container size="xl" className={classes.wrapper}>
            <Title className={classes.title} align="center">
                Cryptuoso
                <span className={classes.highlight}>Telegram</span>
                Trading Bot
            </Title>
            <Grid grow gutter="xl" justify="center" align="center">
                <Grid.Col span={4}>
                    <div className={classes.imageWrapper}>
                        <Image src="/phone-tg.png" alt="Cryptuoso Telegram Bot" className={classes.image} />
                    </div>
                </Grid.Col>
                <Grid.Col span={8}>
                    <div className={classes.content}>
                        <List
                            mt={30}
                            spacing="lg"
                            size="lg"
                            icon={
                                <ThemeIcon size={20} radius="xl">
                                    <Check size={12} />
                                </ThemeIcon>
                            }
                        >
                            <List.Item>
                                <b>Inspect</b> public tarding statistics we&apos;ve collected in over 4 years of trading
                                on the cryptocurrency market.
                            </List.Item>
                            <List.Item>
                                <b>Choose</b> one of predefined profitable portfolios carefully selected for you.
                            </List.Item>
                            <List.Item>
                                <b>Manage</b> your Cryptuoso trading settings and subscriptions directly from Telegram.
                            </List.Item>
                            <List.Item>
                                <b>Receive</b> trading signals and alerts from our robots instantly in real time.
                            </List.Item>
                        </List>

                        <Group mt={30}>
                            <Button
                                component={SimpleLink}
                                href="https://t.me/cryptuoso_bot"
                                size="xl"
                                className={classes.control}
                                variant="gradient"
                                gradient={{ from: "blue", to: "cyan" }}
                            >
                                Get started
                            </Button>
                        </Group>
                    </div>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
