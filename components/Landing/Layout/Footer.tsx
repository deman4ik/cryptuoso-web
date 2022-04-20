import React from "react";
import { createStyles, Anchor, Group, ActionIcon, Text, useMantineTheme } from "@mantine/core";
import { BrandTwitter, BrandInstagram, BrandTelegram } from "tabler-icons-react";

import { SimpleLink } from "@cryptuoso/components/Link/SimpleLink";
import Image from "next/image";

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: 120,
        width: "100%"
        // borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}`
    },
    poweredBy: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    inner: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: `${theme.spacing.md}px ${theme.spacing.md}px`,

        [theme.fn.smallerThan("sm")]: {
            flexDirection: "column"
        }
    },

    links: {
        [theme.fn.smallerThan("sm")]: {
            marginTop: theme.spacing.lg,
            marginBottom: theme.spacing.sm
        }
    }
}));

interface LandingFooterProps {
    links: { link: string; label: string }[];
}

export function LandingFooter({ links }: LandingFooterProps) {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const items = links.map((link) => (
        <Anchor
            component={SimpleLink}
            color="dimmed"
            key={link.label}
            href={link.link}
            sx={{ lineHeight: 1 }}
            size="sm"
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div className={classes.footer}>
            <div className={classes.poweredBy}>
                <SimpleLink href="https://hasura.io/?ref=powered-by">
                    <Image
                        src={theme.colorScheme === "dark" ? "/hasura-logo-dark.svg" : "/hasura-logo-light.svg"}
                        alt="Powered by Hasura, Instant GraphQL on all your data"
                        width={100}
                        height={30}
                    />
                </SimpleLink>
                <SimpleLink href="https://graphcdn.io/?ref=powered-by">
                    <Image
                        src={
                            theme.colorScheme === "dark"
                                ? "https://graphcdn.io/badge-light.svg"
                                : "https://graphcdn.io/badge.svg"
                        }
                        alt="Powered by GraphCDN, the GraphQL CDN"
                        width={120}
                        height={40}
                    />
                </SimpleLink>
                <SimpleLink href="https://mantine.dev/?ref=powered-by">
                    <Image
                        src={theme.colorScheme === "dark" ? "/mantine-logo-dark.svg" : "/mantine-logo-light.svg"}
                        alt="Powered by Mantine, A fully featured React component library"
                        width={100}
                        height={30}
                    />
                </SimpleLink>
            </div>
            <div className={classes.inner}>
                <Text color="dimmed" sx={{ lineHeight: 1 }} size="sm">
                    © 2022 CRYPTUOSO®
                </Text>
                <Group className={classes.links}>{items}</Group>

                <Group spacing={0} noWrap>
                    <ActionIcon component={SimpleLink} size="lg" href="https://twitter.com/cryptuoso">
                        <BrandTwitter size={18} />
                    </ActionIcon>
                    <ActionIcon component={SimpleLink} size="lg" href="https://instagram.com/cryptuoso">
                        <BrandInstagram size={18} />
                    </ActionIcon>
                    <ActionIcon component={SimpleLink} size="lg" href="https://t.me/cryptuoso">
                        <BrandTelegram size={18} />
                    </ActionIcon>
                </Group>
            </div>
        </div>
    );
}
