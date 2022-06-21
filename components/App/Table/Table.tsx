import React, { ReactNode } from "react";
import { createStyles, Table, Text, ScrollArea, MantineSize, Paper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { CardLine } from "@cryptuoso/components/App/Card";

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));

export type TableData = {
    titles: string[] | ReactNode[];
    rows: { id: string | number; values: ReactNode[] }[];
};

export function ResponsiveTable({ data, breakpoint = "lg" }: { data: TableData; breakpoint?: MantineSize }) {
    const { classes, theme } = useStyles();

    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints[breakpoint]}px)`, false);

    const rows = data.rows.map((row) => {
        if (mobile) {
            return (
                <Paper shadow="sm" p="sm" mb="sm" radius="lg" key={row.id}>
                    {row.values.map((value, i) => {
                        return <CardLine loading={false} key={i} title={data.titles[i]} value={value} />;
                    })}
                </Paper>
            );
        }
        return (
            <tr key={row.id}>
                {row.values.map((value, i) => {
                    return <td key={i}>{value}</td>;
                })}
            </tr>
        );
    });

    return mobile ? (
        <>
            {rows && rows.length ? (
                rows
            ) : (
                <Text color="dimmed" m="xs" align="center">
                    No Data
                </Text>
            )}
        </>
    ) : (
        <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
            <thead>
                <tr>
                    {data.titles.map((title, id) => {
                        return (
                            <th key={id}>
                                {typeof title === "string" ? (
                                    <Text size="sm" color="dimmed" align="center">
                                        {title}
                                    </Text>
                                ) : (
                                    title
                                )}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {rows && rows.length ? (
                    rows
                ) : (
                    <Text color="dimmed" m="xs">
                        No Data
                    </Text>
                )}
            </tbody>
        </Table>
    );
}
