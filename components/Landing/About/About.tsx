import React from "react";
import { Container, createStyles, Grid, Group, SimpleGrid, Text, Title, useMantineTheme } from "@mantine/core";
import { TeamCard } from "./TeamCard";

const useStyles = createStyles((theme) => {
    return {
        wrapper: {
            paddingTop: theme.spacing.xl * 2,
            paddingBottom: theme.spacing.xl * 2,
            minHeight: 650
        },

        title: {
            fontWeight: 900,
            marginBottom: theme.spacing.xl * 1.5
        }
    };
});

export function About() {
    const { classes } = useStyles();

    return (
        <Container size="xl" my="md">
            <Title align="center" className={classes.title}>
                About us
            </Title>
            <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
                <Group>
                    <Text size="lg" weight={700}>
                        If nobody can offer you a product you need - make it by yourself...{" "}
                    </Text>
                    <Text color="dimmed">
                        We started long ago by trading on the stock exchange and was always looking for opportunities to{" "}
                        <Text
                            variant="gradient"
                            gradient={{ from: "indigo", to: "violet", deg: 45 }}
                            inherit
                            component="span"
                        >
                            automate our trading.
                        </Text>{" "}
                        With the rapid growth of crypto exchanges, manual trading has become even more{" "}
                        <Text
                            variant="gradient"
                            gradient={{ from: "orange", to: "yellow", deg: 45 }}
                            inherit
                            component="span"
                        >
                            unpredictable.
                        </Text>
                    </Text>
                    <Text color="dimmed">
                        Advanced traders know about services where you can create your own trading strategy and automate
                        it with a robot. We tried to trade through them, but there is a problem that these robots have a
                        very limited functionality. So in order to really control your trading, you need a tailor-made
                        solution developed from scratch.
                    </Text>
                    <Text color="dimmed">
                        That's how and why we created{" "}
                        <Text component="span" variant="gradient" gradient={{ from: "blue", to: "cyan" }} inherit>
                            Cryptuoso
                        </Text>{" "}
                        - a service for automated cryptocurrency trading. Our robots use{" "}
                        <Text
                            variant="gradient"
                            gradient={{ from: "indigo", to: "violet", deg: 45 }}
                            inherit
                            component="span"
                        >
                            advanced strategies
                        </Text>{" "}
                        and do not require users to have any programming skills.
                    </Text>
                    <Text color="dimmed">
                        We shared our service with our friends, and they convinced us that{" "}
                        <Text component="span" variant="gradient" gradient={{ from: "blue", to: "cyan" }} inherit>
                            Cryptuoso
                        </Text>{" "}
                        should be useful for other crypto-enthusiasts - both for beginners and experienced traders.
                    </Text>
                    <Text size="lg" weight={700}>
                        We are warmly welcome you in the community of a product created by traders and for traders.
                    </Text>
                </Group>
                <Grid gutter="md">
                    <Grid.Col span={6}>
                        <TeamCard
                            image="/team/bg1.png"
                            avatar="/team/t1.png"
                            name="Kirill"
                            job="CEO"
                            info={[
                                "Professional trader",
                                "More than 10 years experience of trading on financial markets",
                                "For last six years Kirill making income only from automated trading",
                                "Created and tested more than 1000 trading strategies and many robots, based on them"
                            ]}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TeamCard
                            image="/team/bg2.png"
                            avatar="/team/t2.png"
                            name="Dimitriy"
                            job="CTO"
                            info={[
                                "Full Stack Developer",
                                "More than 13 years experience in enterprise IT-industry",
                                "Developed and maintained high-loaded services and infrastructure",
                                "Teamlead for other Cryptuoso developers"
                            ]}
                        />
                    </Grid.Col>
                </Grid>
            </SimpleGrid>
        </Container>
    );
}
