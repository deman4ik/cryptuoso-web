import { DefaultMantineColor, Group, Skeleton, Text, Tooltip } from "@mantine/core";
import { ReactNode } from "react";

export function CardLine({
    title,
    titleTooltip,
    loading,
    value,
    valueTooltip,
    valueTooltipColor
}: {
    loading: boolean;
    title: string;
    titleTooltip?: ReactNode | string;
    value?: ReactNode | string;
    valueTooltip?: ReactNode | string;
    valueTooltipColor?: DefaultMantineColor;
}) {
    let Title;
    const TitleText = (
        <Text size="sm" color="dimmed" weight={700} sx={{ lineHeight: 2 }}>
            {title}
        </Text>
    );
    if (titleTooltip) {
        Title = (
            <Tooltip transition="fade" transitionDuration={500} transitionTimingFunction="ease" label={titleTooltip}>
                {TitleText}
            </Tooltip>
        );
    } else Title = TitleText;

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
        <Group position="apart" mt="md">
            {Title}
            {loading ? <Skeleton height={8} width="30%" /> : Value}
        </Group>
    );
}
