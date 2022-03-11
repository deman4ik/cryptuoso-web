import React from "react";
import { createStyles, Header, Container, Group, Burger, Transition, Paper, Grid } from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "../Images/Logo";
import { TextLink } from "../Link/TextLink";
import { ColorSchemeToggle } from "../Button/ColorSchemeToggle";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    inner: {
        height: HEADER_HEIGHT,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    links: {
        [theme.fn.smallerThan("sm")]: {
            display: "none"
        }
    },

    burger: {
        [theme.fn.largerThan("sm")]: {
            display: "none"
        }
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 6px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

        fontSize: theme.fontSizes.sm,
        [theme.fn.smallerThan("sm")]: {
            fontSize: theme.fontSizes.xs
        },
        fontWeight: 500,

        "&:hover": {
            color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[8]
            // backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
        }
    },

    linkLabel: {
        marginRight: 5
    },

    dropdown: {
        position: "absolute",
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: "hidden",

        [theme.fn.largerThan("sm")]: {
            display: "none"
        }
    }
}));

interface HeaderActionProps {
    links: { link: string; label: string }[];
}

export function LandingHeader({ links }: HeaderActionProps) {
    const { classes } = useStyles();
    const [opened, toggleOpened] = useBooleanToggle(false);
    const { data: session } = useSession();

    const items = links.map((link) => {
        return (
            <TextLink key={link.label} href={link.link} className={classes.link} transform="uppercase">
                {link.label}
            </TextLink>
        );
    });

    return (
        <Header height={HEADER_HEIGHT} fixed>
            <Container size="xl" className={classes.inner}>
                <Group spacing={4}>
                    <Burger opened={opened} onClick={() => toggleOpened()} className={classes.burger} size="sm" />
                    <Logo href="/" />
                    <TextLink href="/" transform="uppercase" className={classes.link}>
                        Cryptuoso
                    </TextLink>
                </Group>

                <Group spacing={4} className={classes.links}>
                    {items}
                </Group>

                <Group spacing={4}>
                    {session ? (
                        <>
                            <TextLink
                                href="/app/trading"
                                transform="uppercase"
                                variant="gradient"
                                className={classes.link}
                                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                            >
                                TRADING
                            </TextLink>
                            <TextLink onClick={() => signOut()} className={classes.link} transform="uppercase">
                                SIGN OUT
                            </TextLink>
                        </>
                    ) : (
                        <TextLink
                            href="/auth/signin"
                            className={classes.link}
                            transform="uppercase"
                            variant="gradient"
                            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                        >
                            SIGN IN
                        </TextLink>
                    )}
                    <ColorSchemeToggle />
                </Group>

                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} withBorder style={styles}>
                            {items}
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header>
    );
}
