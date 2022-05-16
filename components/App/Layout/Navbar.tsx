import React, { useState } from "react";
import { createStyles, Navbar, Group, Text, ScrollArea } from "@mantine/core";
import { BellRinging, Key, Receipt2, Dashboard, Logout, UserCircle, BrandTelegram } from "tabler-icons-react";
import { signOut } from "next-auth/react";
import { ColorSchemeToggleBig } from "@cryptuoso/components/Button/ColorSchemeToggle";
import { SimpleLink } from "@cryptuoso/components/Link/SimpleLink";
import { useRouter } from "next/router";

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef("icon");
    return {
        navbar: {
            borderRight: "1px solid transparent",
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
        },
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5
            //   borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            [theme.fn.smallerThan("md")]: {
                marginBottom: theme.spacing.xl * 5
            }
            //  borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`
        },

        link: {
            ...theme.fn.focusStyles(),
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            fontSize: theme.fontSizes.sm,
            color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            "&:hover": {
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
                color: theme.colorScheme === "dark" ? theme.white : theme.black,

                [`& .${icon}`]: {
                    color: theme.colorScheme === "dark" ? theme.white : theme.black
                }
            }
        },

        linkIcon: {
            ref: icon,
            color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
            marginRight: theme.spacing.sm
        },

        linkActive: {
            "&, &:hover": {
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,

                color: theme.colorScheme === "dark" ? theme.white : theme.black,
                [`& .${icon}`]: {
                    color: theme.colorScheme === "dark" ? theme.white : theme.black
                }
            }
        }
    };
});

const data = [
    { link: "/app", label: "Dashboard", icon: Dashboard },
    { link: "/app/notifications", label: "Notifications", icon: BellRinging },
    { link: "/app/profile", label: "Profile", icon: UserCircle },
    { link: "/app/exchange-account", label: "Exchange Account", icon: Key },
    { link: "/app/billing", label: "Billing", icon: Receipt2 }
];

export function AppNavbar({ ...others }) {
    const { classes, cx } = useStyles();
    const router = useRouter();

    const links = data.map((item) => (
        <SimpleLink
            className={cx(classes.link, { [classes.linkActive]: item.link === router.pathname })}
            href={item.link}
            key={item.label}
        >
            <item.icon className={classes.linkIcon} />
            <span>{item.label}</span>
        </SimpleLink>
    ));

    return (
        <Navbar fixed className={classes.navbar} {...others}>
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                {links}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <SimpleLink href="https://t.me/cryptuoso_bot" className={classes.link}>
                    <BrandTelegram className={classes.linkIcon} />
                    <span>Telegram Trading Bot</span>
                </SimpleLink>
                <ColorSchemeToggleBig />

                <a
                    href="#"
                    className={classes.link}
                    onClick={(event) => {
                        event.preventDefault();
                        signOut();
                    }}
                >
                    <Logout className={classes.linkIcon} />
                    <span>Sign Out</span>
                </a>
            </Navbar.Section>
        </Navbar>
    );
}
