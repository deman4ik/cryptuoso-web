import React from "react";
import { createStyles, Navbar, Group, Text, ScrollArea, Indicator, Space } from "@mantine/core";
import {
    BellRinging,
    Logout,
    UserCircle,
    BrandTelegram,
    Tools,
    Briefcase,
    ChartCandle,
    InfoCircle,
    Help,
    InfoSquare
} from "tabler-icons-react";
import { signOut, useSession } from "next-auth/react";
import { ColorSchemeToggleBig } from "@cryptuoso/components/Landing/Layout";
import { SimpleLink } from "@cryptuoso/components/Link";
import { useRouter } from "next/router";
import { Logo } from "@cryptuoso/components/Image";
import { useMediaQuery } from "@mantine/hooks";

const useStyles = createStyles((theme, _params, getRef) => {
    const icon: string = getRef("icon");
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

export const linksData = [
    { link: "/app", label: "Trading", icon: ChartCandle, showOnMobile: true, notifications: false },
    { link: "/app/portfolios", label: "Public Portfolios", icon: Briefcase, showOnMobile: true, notifications: false },
    { link: "/app/notifications", label: "Notifications", icon: BellRinging, showOnMobile: false, notifications: true },
    { link: "/app/accounts", label: "Accounts", icon: UserCircle, showOnMobile: false, notifications: false }
];

export function AppNavbar({ notifications, ...others }: { notifications: string | null } & any) {
    const { classes, cx, theme } = useStyles();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints["md"]}px)`, false);
    const { data: session } = useSession<true>({ required: true });
    const router = useRouter();

    const links = linksData
        .filter(({ showOnMobile }) => {
            if (mobile) {
                return showOnMobile;
            } else return true;
        })
        .map((item) => (
            <SimpleLink
                className={cx(classes.link, {
                    [classes.linkActive]: item.link === router.pathname.replace("/[[...slug]]", "")
                })}
                href={item.link}
                key={item.label}
            >
                <Indicator
                    key={item.label}
                    color="indigo"
                    position="top-end"
                    disabled={!item.notifications || !notifications}
                    inline
                    label={notifications}
                    size={14}
                    offset={-3}
                >
                    <item.icon className={classes.linkIcon} />
                </Indicator>
                <span>{item.label}</span>
            </SimpleLink>
        ));

    return (
        <Navbar fixed className={classes.navbar} {...others}>
            {!mobile && (
                <Group mb="sm" mx="xs">
                    <SimpleLink href="/app" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Logo />
                    </SimpleLink>
                    <Text component={SimpleLink} transform="uppercase" weight={700} size="lg" href="/app">
                        Cryptuoso
                    </Text>
                </Group>
            )}
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                {links}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                {session?.user.allowedRoles.includes("manager") && (
                    <SimpleLink href="/manage" className={classes.link}>
                        <Tools className={classes.linkIcon} />
                        <span>Manage</span>
                    </SimpleLink>
                )}

                <SimpleLink href="/docs" className={classes.link} target="_blank">
                    <InfoSquare className={classes.linkIcon} />
                    <span>Docs</span>
                </SimpleLink>
                <SimpleLink href="/docs/support" className={classes.link} target="_blank">
                    <Help className={classes.linkIcon} />
                    <span>Support</span>
                </SimpleLink>
                <Space h="lg" />
                <SimpleLink href="https://t.me/cryptuoso_bot" className={classes.link} target="_blank">
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
