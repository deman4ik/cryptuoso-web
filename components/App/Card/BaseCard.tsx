import { Card, createStyles, LoadingOverlay } from "@mantine/core";
import { ReactNode } from "react";

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));

export function BaseCard({ fetching = false, children }: { fetching?: boolean; children: ReactNode }) {
    const { classes } = useStyles();
    return (
        <Card shadow="sm" p="sm" radius="lg" className={classes.card}>
            <LoadingOverlay visible={fetching} />
            {children}
        </Card>
    );
}
