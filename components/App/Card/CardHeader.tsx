import { ReactNode } from "react";
import { Text, Group } from "@mantine/core";

export function CardHeader({ title, rightActions }: { title: string; rightActions: ReactNode }) {
    return (
        <Group position="apart" mb="md">
            <Text size="md" weight={900} transform="uppercase" color="dimmed">
                {title}
            </Text>
            {rightActions}
        </Group>
    );
}
