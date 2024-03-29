import React from "react";
import { createStyles, Container, Title, Button, Group, List, ThemeIcon, Grid, useMantineTheme } from "@mantine/core";
import { Check } from "tabler-icons-react";
import { SimpleLink } from "@cryptuoso/components/Link";
import Image from "next/image";
import phoneTgImage from "@cryptuoso/public/phone-tg.png";

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

/*export function TelegramWidget({ colorScheme }: { colorScheme: string }) {
    const script = `<script async src="https://telegram.org/js/telegram-widget.js?19"
    data-telegram-post="cryptuoso/451" data-width="100%" 
    data-userpic="true" data-color="343638" 
    data-dark="${colorScheme}"
     data-dark-color="FFFFFF"></script>`;
    return (
        <div
            key={new Date().getTime()}
            dangerouslySetInnerHTML={{
                __html: script
            }}
        />
    );
}
*/
export function TelegramBot() {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    return (
        <Container size="xl" className={classes.wrapper}>
            <Grid gutter="xl" justify="center" align="center">
                <Grid.Col sm={3}>
                    <div className={classes.imageWrapper}>
                        <Image src={phoneTgImage} alt="Cryptuoso Telegram Bot" />
                    </div>
                </Grid.Col>
                <Grid.Col sm={6}>
                    <div className={classes.content}>
                        <Title className={classes.title} align="center">
                            Cryptuoso Telegram Trading Bot
                        </Title>
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
                                <b>Inspect</b> public trading statistics we&apos;ve collected in over 4 years of trading
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
                                gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
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
