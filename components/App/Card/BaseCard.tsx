import { Card, createStyles, LoadingOverlay, MantineNumberSize, MantineShadow, Stack, Sx } from "@mantine/core";
import { ReactNode } from "react";

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        height: "100%"
    }
}));

export function BaseCard({
    fetching = false,
    children,
    sx,
    radius = "lg",
    shadow = "sm",
    justify = "space-between",
    align,
    ...other
}: {
    fetching?: boolean;
    radius?: MantineNumberSize;
    shadow?: MantineShadow;
    justify?: React.CSSProperties["justifyContent"];
    align?: React.CSSProperties["alignItems"];
    sx?: Sx;
    mt?: React.CSSProperties["marginTop"];
    children: ReactNode;
}) {
    const { classes } = useStyles();
    return (
        <Card shadow={shadow} p="xs" radius={radius} className={classes.card} sx={sx} {...other} withBorder={false}>
            <LoadingOverlay visible={fetching} />

            <Stack justify={justify} align={align} spacing={0} sx={{ height: "100%" }}>
                {children}
            </Stack>
        </Card>
    );
}
