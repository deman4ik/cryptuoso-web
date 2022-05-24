import { Card, createStyles, LoadingOverlay, Stack, Sx } from "@mantine/core";
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
    ...other
}: {
    fetching?: boolean;
    sx?: Sx;
    children: ReactNode;
}) {
    const { classes } = useStyles();
    return (
        <Card shadow="sm" p="sm" radius="lg" className={classes.card} sx={sx} {...other}>
            <LoadingOverlay visible={fetching} />
            <Stack justify="flex-end" spacing={0}>
                {children}
            </Stack>
        </Card>
    );
}
