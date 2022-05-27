import { ReactNode } from "react";
import { Text, Group, Stack } from "@mantine/core";

export function CardHeader({ title, left, right }: { title: string; left?: ReactNode; right?: ReactNode }) {
    return (
        <Group position="apart" mb="md" align="flex-start">
            <Stack align="flex-start" spacing={0}>
                <Text size="md" weight={900} transform="uppercase" color="dimmed">
                    {title}
                </Text>
                {left}
            </Stack>
            {right}
        </Group>
    );
}
