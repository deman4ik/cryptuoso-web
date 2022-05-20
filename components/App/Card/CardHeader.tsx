import { ReactNode } from "react";
import { Text, Group } from "@mantine/core";

export function CardHeader({ title, left, right }: { title: string; left?: ReactNode; right?: ReactNode }) {
    return (
        <Group position="apart" mb="md">
            <Group align="center" spacing="xs" position="center">
                <Text size="md" weight={900} transform="uppercase" color="dimmed">
                    {title}
                </Text>
                {left}
            </Group>
            {right}
        </Group>
    );
}
