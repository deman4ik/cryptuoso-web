import { Group, Stack, Text, Button } from "@mantine/core";
import { ReactNode } from "react";
import { ChevronRight } from "tabler-icons-react";

export function Section({ title, children }: { title: string; children?: ReactNode }) {
    return (
        <Stack>
            <Group position="apart">
                <Text weight={600} size="md" transform="uppercase" color="white">
                    {title}
                </Text>
                <Button size="md" variant="subtle" compact uppercase rightIcon={<ChevronRight />}>
                    MORE
                </Button>
            </Group>
            {children}
        </Stack>
    );
}
