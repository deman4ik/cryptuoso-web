import React from "react";
import { Container, Title, Accordion, createStyles, Grid, Text } from "@mantine/core";
import { faqContent } from "./content";

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

        control: {
            ref: control,

            "&:hover": {
                backgroundColor: "transparent"
            }
        },

        item: {
            //  borderRadius: theme.radius.md,
            marginBottom: theme.spacing.lg,
            border: "1px solid transparent"
            //  border: `0.5px solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[3]}`
        },

        itemOpened: {
            [`& .${control}`]: {
                color: theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
            }
        },

        text: {
            marginTop: theme.spacing.sm
        }
    };
});

export function FAQ() {
    const { classes } = useStyles();
    const leftFaqContent = faqContent.slice(0, Math.round(faqContent.length / 2));
    const rightFaqContent = faqContent.slice(leftFaqContent.length);
    return (
        <Container size="xl" className={classes.wrapper} id="faq">
            <Title align="center" className={classes.title}>
                Frequently Asked Questions
            </Title>

            <Grid columns={12} grow>
                <Grid.Col md={1} lg={2}>
                    <Accordion
                        iconPosition="right"
                        classNames={{
                            item: classes.item,
                            itemOpened: classes.itemOpened,
                            control: classes.control
                        }}
                    >
                        {leftFaqContent.map((c, i) => (
                            <Accordion.Item label={c.title} key={i}>
                                {c.text.map((t, i) => (
                                    <Text className={classes.text} key={i}>
                                        {t}
                                    </Text>
                                ))}
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Grid.Col>
                <Grid.Col md={1} lg={2}>
                    <Accordion
                        iconPosition="right"
                        classNames={{
                            item: classes.item,
                            itemOpened: classes.itemOpened,
                            control: classes.control
                        }}
                    >
                        {rightFaqContent.map((c, i) => (
                            <Accordion.Item label={c.title} key={i}>
                                {c.text.map((t, i) => (
                                    <Text className={classes.text} key={i}>
                                        {t}
                                    </Text>
                                ))}
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
