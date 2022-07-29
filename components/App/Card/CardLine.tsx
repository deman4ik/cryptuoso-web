import { GroupProps } from "@mantine/core";
import { StackProps } from "@mantine/core";
import {
    DefaultMantineColor,
    Group,
    GroupPosition,
    Skeleton,
    Text,
    Tooltip,
    MantineNumberSize,
    Stack,
    TextProps
} from "@mantine/core";
import { ReactElement, ReactNode } from "react";

export function CardLine({
    title,
    titleTooltip,
    titleProps,
    loading,
    value,
    valueProps,
    valueTooltip,
    valueTooltipColor,
    position = "apart",
    mt = "md",
    variant = "group",
    containerProps
}: {
    loading: boolean;
    title?: ReactNode | string;
    titleTooltip?: ReactNode | string;
    titleProps?: TextProps;
    value?: ReactNode | string;
    valueProps?: TextProps;
    valueTooltip?: ReactNode | string;
    valueTooltipColor?: DefaultMantineColor;
    position?: GroupPosition;
    mt?: MantineNumberSize;
    variant?: "stack" | "group";
    containerProps?: GroupProps | StackProps;
}) {
    let Title;
    const TitleComponent =
        typeof title === "string" ? (
            <Text size="sm" color="dimmed" weight={700} sx={{ lineHeight: 2 }} {...titleProps}>
                {title}
            </Text>
        ) : (
            title
        );
    if (titleTooltip) {
        Title = (
            <Tooltip
                multiline
                transition="fade"
                transitionDuration={500}
                label={titleTooltip}
                events={{ hover: true, touch: true, focus: false }}
            >
                {TitleComponent}
            </Tooltip>
        );
    } else Title = TitleComponent;

    let Value;
    const ValueComponent =
        typeof value === "string" ? (
            <Text size="sm" weight={500} {...valueProps}>
                {value}
            </Text>
        ) : (
            value
        );
    if (valueTooltip) {
        Value = (
            <Tooltip
                multiline
                transition="fade"
                transitionDuration={500}
                color={valueTooltipColor}
                label={valueTooltip}
                events={{ hover: true, touch: true, focus: false }}
            >
                {ValueComponent}
            </Tooltip>
        );
    } else Value = ValueComponent;

    return variant === "group" ? (
        <Group position={position} mt={mt} {...containerProps}>
            {Title}
            {loading ? <Skeleton height={8} width="30%" /> : Value}
        </Group>
    ) : (
        <Stack justify={position} mt={mt} spacing="xs" {...containerProps}>
            {Title}
            {loading ? <Skeleton height={8} width="30%" /> : Value}
        </Stack>
    );
}
