import React from "react";
import { createStyles, Navbar, ScrollArea } from "@mantine/core";
import { Dashboard, Logout, Briefcase, ArrowBarLeft, Robot, TestPipe, Users, UserCheck } from "tabler-icons-react";
import { signOut } from "next-auth/react";
import { ColorSchemeToggleBig } from "@cryptuoso/components/Landing/Layout";
import { SimpleLink } from "@cryptuoso/components/Link";
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
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            [theme.fn.smallerThan("md")]: {
                marginBottom: theme.spacing.xl * 5
            }
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
    { link: "/manage", label: "Monitoring", icon: Dashboard },
    { link: "/manage/users", label: "Users", icon: Users },
    { link: "/manage/user-portfolios", label: "User Portfolios", icon: UserCheck },
    { link: "/manage/portfolios", label: "Portfolios", icon: Briefcase },
    { link: "/manage/robots", label: "Robots", icon: Robot },
    { link: "/manage/backtests", label: "Backtests", icon: TestPipe }
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
                <SimpleLink href="/app" className={classes.link}>
                    <ArrowBarLeft className={classes.linkIcon} />
                    <span>Back to App</span>
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
