import React from "react";
import { createStyles, Header, Container, Group, Burger, Transition, Paper } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { useSession, signOut } from "next-auth/react";
import { Logo } from "@cryptuoso/components/Image";
import { TextLink, SimpleLink } from "@cryptuoso/components/Link";
import { ColorSchemeToggle } from "@cryptuoso/components/Landing/Layout";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    header: {
        borderBottom: "0px"
    },
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
        marginRight: "20px",
        [theme.fn.largerThan("sm")]: {
            display: "none"
        }
    },

    flex: {
        flex: 1
    },
    right: {
        justifyContent: "flex-end"
    },
    link: {
        display: "block",
        lineHeight: 1,
        padding: "10px 8px",
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
    const { classes, cx } = useStyles();
    const [opened, toggleOpened] = useToggle([false, true]);
    const { data: session } = useSession();

    const items = links.map((link) => {
        return (
            <TextLink key={link.label} href={link.link} className={classes.link} transform="uppercase">
                {link.label}
            </TextLink>
        );
    });

    return (
        <Header height={HEADER_HEIGHT} fixed className={classes.header}>
            <Container size="xl" className={classes.inner}>
                <Burger opened={opened} onClick={() => toggleOpened()} className={classes.burger} size="sm" />
                <Group spacing={4} className={classes.flex}>
                    <SimpleLink href="/">
                        <Logo />
                    </SimpleLink>
                    <TextLink href="/" transform="uppercase" className={classes.link}>
                        Cryptuoso
                    </TextLink>
                </Group>

                <Group spacing={4} className={classes.links}>
                    {items}
                </Group>

                <Group spacing={4} className={cx(classes.flex, classes.right)}>
                    {session ? (
                        <TextLink
                            href="/app"
                            transform="uppercase"
                            variant="gradient"
                            className={classes.link}
                            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                        >
                            TRADING
                        </TextLink>
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
