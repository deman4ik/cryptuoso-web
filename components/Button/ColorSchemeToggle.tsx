import { ActionIcon, ActionIconProps, useMantineColorScheme } from "@mantine/core";
import { MoonIcon, SunIcon } from "@modulz/radix-icons";

export function ColorSchemeToggle({ ...others }) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const Icon = colorScheme === "dark" ? SunIcon : MoonIcon;
    return (
        <ActionIcon
            {...others}
            variant="transparent"
            sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.dark[4],
                color: theme.colorScheme === "dark" ? theme.black : theme.colors.blue[2]
            })}
            onClick={() => {
                toggleColorScheme();
            }}
        >
            <Icon />
        </ActionIcon>
    );
}
