import React, { useState } from "react";
import { createStyles, Navbar, Group, Text } from "@mantine/core";
import {
    BellRinging,
    Fingerprint,
    Key,
    Settings,
    TwoFA,
    DatabaseImport,
    Receipt2,
    Dashboard,
    Logout,
    UserCircle
} from "tabler-icons-react";
import { signOut } from "next-auth/react";
import { ColorSchemeToggleBig } from "@cryptuoso/components/Button/ColorSchemeToggle";
import { SimpleLink } from "@cryptuoso/components/Link/SimpleLink";

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
            marginTop: theme.spacing.md
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
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
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
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
                        : theme.colors[theme.primaryColor][0],
                color: theme.colorScheme === "dark" ? theme.white : theme.colors[theme.primaryColor][7],
                [`& .${icon}`]: {
                    color: theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 5 : 7]
                }
            }
        }
    };
});

const data = [
    { link: "/app/dashboard", label: "Dashboard", icon: Dashboard },
    { link: "/app/notifications", label: "Notifications", icon: BellRinging },
    { link: "/app/profile", label: "Profile", icon: UserCircle },
    { link: "/app/exchange-coount", label: "Exchange Account", icon: UserCircle },
    { link: "/app/billing", label: "Billing", icon: Receipt2 }
];

export function AppNavbar({ ...others }) {
    const { classes, cx } = useStyles();
    const [active, setActive] = useState("Dashboard");

    const links = data.map((item) => (
        <SimpleLink
            className={cx(classes.link, { [classes.linkActive]: item.label === active })}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} />
            <span>{item.label}</span>
        </SimpleLink>
    ));

    return (
        <Navbar className={classes.navbar} {...others}>
            <Navbar.Section grow>{links}</Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <ColorSchemeToggleBig />
                <SimpleLink href="/app/profile" className={classes.link}>
                    <UserCircle className={classes.linkIcon} />
                    <span>Profile</span>
                </SimpleLink>

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
