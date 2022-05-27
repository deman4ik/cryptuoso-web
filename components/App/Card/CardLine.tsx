import { DefaultMantineColor, Group, GroupPosition, Skeleton, Text, Tooltip, MantineNumberSize } from "@mantine/core";
import { ReactElement, ReactNode } from "react";

export function CardLine({
    title,
    titleTooltip,
    loading,
    value,
    valueTooltip,
    valueTooltipColor,
    position = "apart",
    mt = "md"
}: {
    loading: boolean;
    title?: ReactNode | string;
    titleTooltip?: ReactNode | string;
    value?: ReactNode | string;
    valueTooltip?: ReactNode | string;
    valueTooltipColor?: DefaultMantineColor;
    position?: GroupPosition;
    mt?: MantineNumberSize;
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
            <Tooltip transition="fade" transitionDuration={500} transitionTimingFunction="ease" label={titleTooltip}>
                {TitleComponent}
            </Tooltip>
        );
    } else Title = TitleComponent;

    let Value;
    const ValueComponent = typeof value === "string" ? <Text size="md">{value}</Text> : value;
    if (valueTooltip) {
        Value = (
            <Tooltip
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

    return (
        <Group position={position} mt={mt}>
            {Title}
            {loading ? <Skeleton height={8} width="30%" /> : Value}
        </Group>
    );
}
