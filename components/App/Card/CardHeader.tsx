import { ReactNode } from "react";
import { Text, Group, Stack, GroupProps } from "@mantine/core";

export function CardHeader({
    title,
    left,
    right,
    ...other
}: { title: string; left?: ReactNode; right?: ReactNode } & GroupProps) {
    return (
        <Group position="apart" mb="md" align="flex-start" spacing={0} {...other}>
            <Stack align="flex-start" spacing={0}>
                <Group>
                    <Text size="md" weight={900} transform="uppercase" color="dimmed">
                        {title}
                    </Text>
                </Group>
                {left}
            </Stack>
            {right}
        </Group>
    );
}
