import React from "react";
import { createStyles, Container, Title, Text, Button } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    root: {
        marginTop: 60,
        backgroundColor: "#11284b",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, ${theme.colors.dark[7]} 85%), url(./hero-bg-s.png)`,
        backgroundRepeat: "no-repeat",
        paddingTop: theme.spacing.xl * 4,
        paddingBottom: theme.spacing.xl * 4,
        [theme.fn.smallerThan("lg")]: {
            paddingTop: theme.spacing.xl * 2,
            paddingBottom: theme.spacing.xl * 2
            //  backgroundImage: `linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, ${theme.colors.dark[7]} 85%), url(./hero-bg.png)`
        },
        [theme.fn.smallerThan("md")]: {
            paddingTop: theme.spacing.xl,
            paddingBottom: theme.spacing.xl
            //   backgroundImage: `linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, ${theme.colors.dark[7]} 85%), url(./hero-bg-sm.png)`
        }
    },

    inner: {
        display: "flex",
        justifyContent: "space-between",

        [theme.fn.smallerThan("md")]: {
            flexDirection: "column"
        }
    },

    image: {
        [theme.fn.smallerThan("md")]: {
            display: "none"
        }
    },

    content: {
        paddingTop: theme.spacing.xl * 2,
        paddingBottom: theme.spacing.xl * 2,
        marginRight: theme.spacing.xl * 3,

        [theme.fn.smallerThan("md")]: {
            marginRight: 0
        }
    },

    title: {
        color: theme.white,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 900,
        lineHeight: 1.05,
        maxWidth: 500,
        fontSize: 48,

        [theme.fn.smallerThan("md")]: {
            maxWidth: "50%",
            fontSize: 34,
            lineHeight: 1.15
        }
    },

    description: {
        color: theme.white,
        opacity: 0.75,
        maxWidth: 500,

        [theme.fn.smallerThan("md")]: {
            maxWidth: "100%"
        }
    },

    control: {
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: 22,

        [theme.fn.smallerThan("md")]: {
            width: "50%"
        }
    }
}));

export function HeroBg() {
    const { classes } = useStyles();
    return (
        <div className={classes.root}>
            <Container size="lg">
                <div className={classes.inner}>
                    <div className={classes.content}>
                        <Title className={classes.title}>
                            <Text
                                component="span"
                                inherit
                                variant="gradient"
                                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                            >
                                CRYPTUOSO
                            </Text>{" "}
                            Cryptocurrency Trading Automation Bot
                        </Title>

                        <Text className={classes.description} mt={30} size="xl">
                            Just invest – robots do the rest
                        </Text>

                        <Button
                            variant="gradient"
                            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                            size="xl"
                            className={classes.control}
                            mt={40}
                        >
                            Get started
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
}
