import React from "react";
import { Text, Burger, createStyles, Group, Button, Indicator } from "@mantine/core";
import { Logo } from "@cryptuoso/components/Image";
import { SimpleLink } from "@cryptuoso/components/Link";
import { useMediaQuery } from "@mantine/hooks";
import { linksData } from "./Navbar";
import { useRouter } from "next/router";
import { useQuery } from "urql";
import { UnreadNotificationsCount } from "@cryptuoso/queries";
import { useSession } from "next-auth/react";

const useStyles = createStyles((theme, _params, getRef) => {
    const icon: string = getRef("icon");
    return {
        burger: {
            [theme.fn.largerThan("md")]: {
                display: "none"
            }
        },
        link: {
            ...theme.fn.focusStyles(),
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            fontSize: theme.fontSizes.sm,
            color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
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
            color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6]
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

export function AppHeader({
    opened,
    setOpened,
    ...other
}: {
    opened: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { classes, cx } = useStyles();
    const router = useRouter();
    const { data: session } = useSession<true>({ required: true });
    const [unreadNotificationsResult, reexecuteUnreadNotificationsQuery] = useQuery<{
        notifications: {
            aggregate: {
                count: number;
            };
        };
    }>({
        query: UnreadNotificationsCount,
        variables: { userId: session?.user?.userId || "" }
    });
    const { data, fetching, error } = unreadNotificationsResult;

    if (error) console.error(error);
    const notifications = data?.notifications?.aggregate?.count
        ? data?.notifications?.aggregate?.count > 99
            ? "99+"
            : `${data?.notifications?.aggregate?.count}`
        : null;

    const links = linksData
        .filter(({ showOnMobile }) => showOnMobile === false)
        .map((item) => (
            <Indicator
                key={item.label}
                color="indigo"
                position="top-end"
                disabled={!item.notifications || !notifications}
                withBorder
                inline
                label={notifications}
                size={14}
                offset={-5}
            >
                <SimpleLink
                    className={cx(classes.link, {
                        [classes.linkActive]: item.link === router.pathname.replace("/[[...slug]]", "")
                    })}
                    href={item.link}
                    key={item.label}
                >
                    <item.icon className={classes.linkIcon} />
                </SimpleLink>
            </Indicator>
        ));

    return (
        <Group spacing={12} position="apart">
            <Burger opened={opened} onClick={() => setOpened((o) => !o)} size="sm" className={classes.burger} />
            <Group spacing={12}>
                <SimpleLink href="/app" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Logo />
                </SimpleLink>
                <Text component={SimpleLink} transform="uppercase" weight={700} size="lg" href="/app">
                    Cryptuoso
                </Text>
            </Group>
            <Group>{links}</Group>
        </Group>
    );
}
