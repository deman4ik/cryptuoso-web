import { Group, Stack, Text, Button, StackProps, MantineStyleSystemSize, MantineNumberSize, Sx } from "@mantine/core";
import { ReactNode } from "react";
import { ChevronRight } from "tabler-icons-react";

export function Section({
    title,
    left,
    right,
    children,
    ...other
}: {
    title: string;
    left?: ReactNode;
    right?: ReactNode;
    children?: ReactNode;
} & StackProps) {
    return (
        <Stack spacing={0} mt="xs" {...other}>
            <Group position="apart" m="xs">
                <Group spacing="xs" align="center">
                    <Text weight={900} size="lg" transform="uppercase" color="dimmed">
                        {title}
                    </Text>
                    {left}
                </Group>
                {right}
            </Group>
            {children}
        </Stack>
    );
}
