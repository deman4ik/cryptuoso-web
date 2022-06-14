import {
    DefaultMantineColor,
    Group,
    GroupPosition,
    Skeleton,
    Text,
    Tooltip,
    MantineNumberSize,
    Stack
} from "@mantine/core";
import { ReactElement, ReactNode } from "react";

export function CardLine({
    title,
    titleTooltip,
    loading,
    value,
    valueTooltip,
    valueTooltipColor,
    position = "apart",
    mt = "md",
    variant = "group"
}: {
    loading: boolean;
    title?: ReactNode | string;
    titleTooltip?: ReactNode | string;
    value?: ReactNode | string;
    valueTooltip?: ReactNode | string;
    valueTooltipColor?: DefaultMantineColor;
    position?: GroupPosition;
    mt?: MantineNumberSize;
    variant?: "stack" | "group";
}) {
    let Title;
    const TitleComponent =
        typeof title === "string" ? (
            <Text size="sm" color="dimmed" weight={700} sx={{ lineHeight: 2 }}>
                {title}
            </Text>
        ) : (
            title
        );
    if (titleTooltip) {
        Title = (
            <Tooltip
                wrapLines
                transition="fade"
                transitionDuration={500}
                transitionTimingFunction="ease"
                label={titleTooltip}
            >
                {TitleComponent}
            </Tooltip>
        );
    } else Title = TitleComponent;

    let Value;
    const ValueComponent =
        typeof value === "string" ? (
            <Text size="sm" weight={500}>
                {value}
            </Text>
        ) : (
            value
        );
    if (valueTooltip) {
        Value = (
            <Tooltip
                wrapLines
                transition="fade"
                transitionDuration={500}
                transitionTimingFunction="ease"
                color={valueTooltipColor}
                label={valueTooltip}
            >
                {ValueComponent}
            </Tooltip>
        );
    } else Value = ValueComponent;

    return variant === "group" ? (
        <Group position={position} mt={mt}>
            {Title}
            {loading ? <Skeleton height={8} width="30%" /> : Value}
        </Group>
    ) : (
        <Stack justify={position} mt={mt} spacing="xs">
            {Title}
            {loading ? <Skeleton height={8} width="30%" /> : Value}
        </Stack>
    );
}
