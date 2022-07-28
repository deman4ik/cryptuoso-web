import React from "react";
import { Container, Title, Accordion, createStyles, Grid, Text } from "@mantine/core";
import { faqContent } from "./content";
import { round } from "helpers";

const useStyles = createStyles((theme, _params, getRef) => {
    const control = getRef("control");

    return {
        wrapper: {
            paddingTop: theme.spacing.xl * 2,
            paddingBottom: theme.spacing.xl * 2,
            minHeight: 550
        },

        title: {
            fontWeight: 900,
            marginBottom: theme.spacing.xl * 1.5
        },

        item: {
            marginBottom: theme.spacing.lg,
            border: "1px solid transparent"
        },

        text: {
            marginTop: theme.spacing.sm
        }
    };
});

export function FAQ() {
    const { classes } = useStyles();
    const leftFaqContent = faqContent.slice(0, round(faqContent.length / 2) || 0);
    const rightFaqContent = faqContent.slice(leftFaqContent.length);
    return (
        <Container size="xl" className={classes.wrapper} id="faq">
            <Title align="center" className={classes.title}>
                Frequently Asked Questions
            </Title>

            <Grid columns={12} grow gutter="xs">
                <Grid.Col md={1} lg={2}>
                    <Accordion variant="filled">
                        {leftFaqContent.map((c, i) => (
                            <Accordion.Item className={classes.item} value={c.title} key={i}>
                                <Accordion.Control>
                                    <Text size="lg" weight={700}>
                                        {c.title}
                                    </Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    {c.text.map((t, i) => (
                                        <Text className={classes.text} key={i} weight={500}>
                                            {t}
                                        </Text>
                                    ))}
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Grid.Col>
                <Grid.Col md={1} lg={2}>
                    <Accordion variant="filled">
                        {rightFaqContent.map((c, i) => (
                            <Accordion.Item className={classes.item} value={c.title} key={i}>
                                <Accordion.Control>
                                    {" "}
                                    <Text size="lg" weight={700}>
                                        {c.title}
                                    </Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    {c.text.map((t, i) => (
                                        <Text className={classes.text} key={i} weight={500}>
                                            {t}
                                        </Text>
                                    ))}
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
