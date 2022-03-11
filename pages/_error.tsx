import React from "react";
import { createStyles, Title, Text, Button, Container, Group } from "@mantine/core";
import { SimpleLink } from "../components/Link/SimpleLink";
import { NextPageContext } from "next";

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: 80,
        paddingBottom: 80
    },

    label: {
        textAlign: "center",
        fontWeight: 900,
        fontSize: 220,
        lineHeight: 1,
        marginBottom: theme.spacing.xl * 1.5,
        color: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],

        [theme.fn.smallerThan("sm")]: {
            fontSize: 120
        }
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        textAlign: "center",
        fontWeight: 900,
        fontSize: 38,

        [theme.fn.smallerThan("sm")]: {
            fontSize: 32
        }
    },

    description: {
        maxWidth: 500,
        margin: "auto",
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl * 1.5
    }
}));

function ErrorPage({ statusCode, errorMessage }: { statusCode: number; errorMessage: string }) {
    const { classes } = useStyles();

    return (
        <Container className={classes.root}>
            <div className={classes.label}>{statusCode}</div>
            <Title className={classes.title}>Something bad just happened...</Title>
            <Text color="dimmed" size="lg" align="center" className={classes.description}>
                {statusCode ? `An error ${statusCode} occurred on server` : "An error occurred on client"}
            </Text>
            {errorMessage && (
                <Text color="dimmed" size="lg" align="center" className={classes.description}>
                    {errorMessage}
                </Text>
            )}
            <Group position="center">
                <Button component={SimpleLink} href="/" variant="subtle" size="md">
                    Take me back to home page
                </Button>
            </Group>
        </Container>
    );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    const errorMessage = err?.message;
    return { statusCode, errorMessage };
};

export default ErrorPage;
