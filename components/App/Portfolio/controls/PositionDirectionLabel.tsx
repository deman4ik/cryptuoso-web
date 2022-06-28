import { PositionDirection } from "@cryptuoso/types";
import { Group, ThemeIcon, Text } from "@mantine/core";
import { ArrowDown, ArrowUp } from "tabler-icons-react";

export function PositionDirectionLabel({ direction }: { direction: PositionDirection }) {
    return (
        <Group spacing="xs" position="left">
            <ThemeIcon color={direction === "long" ? "green" : "red"} variant="light">
                {direction === "long" ? <ArrowUp /> : <ArrowDown />}
            </ThemeIcon>
            <Text
                size="sm"
                weight={500}
                transform="uppercase"
                color={direction === "long" ? "green" : "red"}
                align="left"
            >
                {direction}
            </Text>
        </Group>
    );
}
