import { Group, Stack, Text, Button } from "@mantine/core";
import { ReactNode } from "react";
import { ChevronRight } from "tabler-icons-react";

export function Section({
    title,
    left,
    right,
    children
}: {
    title: string;
    left?: ReactNode;
    right?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <Stack spacing={0}>
            <Group position="apart" m="xs" mt="xl">
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
