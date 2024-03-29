import React from "react";
import {
    Container,
    Title,
    Accordion,
    createStyles,
    Grid,
    Text,
    useMantineTheme,
    SimpleGrid,
    Skeleton,
    Stack,
    Group,
    Overlay
} from "@mantine/core";
import Image from "next/image";

const useStyles = createStyles((theme) => {
    return {
        wrapper: {
            paddingTop: theme.spacing.xl * 2,
            paddingBottom: theme.spacing.xl * 2,
            minHeight: 250
        },

        title: {
            fontWeight: 900,
            marginBottom: theme.spacing.xl * 2
        },

        imageWrapper: {
            position: "relative"
        },
        overlay: {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.white
        }
    };
});

export function Exchanges() {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    return (
        <div>
            <Container className={classes.wrapper} id="exchanges">
                <Grid grow justify="center" gutter="xs">
                    <Grid.Col md={5}>
                        <Text
                            variant="gradient"
                            gradient={{ from: "yellow", to: "lime", deg: 45 }}
                            size="xl"
                            align="center"
                            weight={700}
                        >
                            Supported Exchanges
                        </Text>
                        <Group position="center" spacing="xl">
                            <div>
                                <Image src="/binance_futures.svg" alt="Binance Futures" height="100" width="200" />
                            </div>
                        </Group>
                    </Grid.Col>
                    <Grid.Col md={7}>
                        <Text
                            variant="gradient"
                            gradient={{ from: theme.primaryColor, to: "violet", deg: 45 }}
                            size="xl"
                            align="center"
                            weight={700}
                        >
                            Coming Soon
                        </Text>
                        <Group position="center" spacing="xl">
                            <div className={classes.imageWrapper}>
                                <Overlay
                                    opacity={0.6}
                                    color={theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white}
                                    zIndex={5}
                                />
                                <Image src="/kucoin_futures.svg" alt="KuCoin Futures" height="100" width="150" />
                            </div>
                            <div className={classes.imageWrapper}>
                                <Overlay
                                    opacity={0.6}
                                    color={theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white}
                                    zIndex={5}
                                />
                                <Image src="/huobi_futures.svg" alt="Huobi Futures" height="100" width="200" />
                            </div>
                        </Group>
                    </Grid.Col>
                </Grid>
            </Container>
        </div>
    );
}
