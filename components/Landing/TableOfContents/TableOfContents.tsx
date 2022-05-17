import React from "react";
import { createStyles, Box, Text, Group } from "@mantine/core";
import { ListSearch } from "tabler-icons-react";
import { SimpleLink } from "@cryptuoso/components/Link";

const useStyles = createStyles((theme) => ({
    link: {
        ...theme.fn.focusStyles(),
        display: "block",
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        lineHeight: 1.2,
        fontSize: theme.fontSizes.sm,
        padding: theme.spacing.xs,
        borderTopRightRadius: theme.radius.sm,
        borderBottomRightRadius: theme.radius.sm,
        borderLeft: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
        }
    },

    linkActive: {
        fontWeight: 500,
        borderLeftColor: theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 6 : 7],
        color: theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 2 : 7],

        "&, &:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
                    : theme.colors[theme.primaryColor][0]
        }
    }
}));

export interface TableOfContentsProps {
    links: { label: string; link: string; order: number; child: boolean }[];
    active: string;
}

export function TableOfContents({ links, active }: TableOfContentsProps) {
    const { classes, cx } = useStyles();

    const items = links.map((item) => (
        <Box
            component={SimpleLink}
            href={item.link}
            key={item.label}
            className={cx(classes.link, { [classes.linkActive]: active === item.link })}
            sx={(theme) => ({ paddingLeft: item.child ? 2 * theme.spacing.md : theme.spacing.md })}
        >
            {item.label}
        </Box>
    ));

    return (
        <div>
            <Group mb="md">
                <ListSearch size={18} />
                <Text>Table of contents</Text>
            </Group>
            {items}
        </div>
    );
}
