import React, { useContext } from "react";
import {
    Text,
    Burger,
    createStyles,
    Group,
    Paper,
    Transition,
    ActionIcon,
    Stack,
    MantineNumberSize
} from "@mantine/core";
import { Logo } from "@cryptuoso/components/Image";
import { SimpleLink } from "@cryptuoso/components/Link";
import { PeriodFilter, RefreshRate } from "@cryptuoso/components/Manage/Filters";
import { FiltersContext } from "./Layout";
import { useBooleanToggle } from "@mantine/hooks";
import { Filter, X } from "tabler-icons-react";

const HEADER_HEIGHT = 60;
const sizes = {
    xs: 12,
    sm: 18,
    md: 24,
    lg: 34,
    xl: 42
};
const useStyles = createStyles((theme, { size }: { size: MantineNumberSize }, getRef) => {
    const sizeValue = theme.fn.size({ size, sizes });
    return {
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        },

        burger: {
            [theme.fn.largerThan("md")]: {
                display: "none"
            }
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
            padding: 10,
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
            [theme.fn.largerThan("sm")]: {
                display: "none"
            }
        },

        filters: {
            [theme.fn.smallerThan("sm")]: {
                display: "none"
            }
        },
        logoText: {
            [theme.fn.smallerThan("sm")]: {
                fontSize: theme.fontSizes.xs
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
    const { classes } = useStyles({ size: "md" });
    const filters = useContext(FiltersContext);
    const [filtersOpened, toggleFiltersOpened] = useBooleanToggle(false);
    const items = (
        <>
            <PeriodFilter dates={filters.dates} setDates={filters.setDates} />
            <RefreshRate value={filters.refreshRate} setValue={filters.setRefreshRate} />
        </>
    );
    return (
        <div className={classes.header}>
            <Group className={classes.header} position="apart" spacing={12}>
                <Burger opened={opened} onClick={() => setOpened((o) => !o)} size="sm" className={classes.burger} />
                <SimpleLink href="/app" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Logo />
                </SimpleLink>
                <Text
                    component={SimpleLink}
                    transform="uppercase"
                    weight={700}
                    size="lg"
                    href="/app"
                    className={classes.logoText}
                >
                    Cryptuoso
                </Text>
            </Group>
            <ActionIcon size="md" onClick={() => toggleFiltersOpened((o) => !o)} className={classes.burger}>
                {filtersOpened ? <X size="md" /> : <Filter size="sm" />}
            </ActionIcon>
            <Group className={classes.filters}>{items}</Group>
            <Transition transition="pop-top-right" duration={200} mounted={filtersOpened}>
                {(styles) => (
                    <Group className={classes.dropdown} style={styles} position="right">
                        {items}
                    </Group>
                )}
            </Transition>
        </div>
    );
}
