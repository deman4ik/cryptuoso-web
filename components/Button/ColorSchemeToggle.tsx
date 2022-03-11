import { ActionIcon, ActionIconProps, useMantineColorScheme } from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";

export function ColorSchemeToggle({ ...others }) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <ActionIcon
            {...others}
            variant="transparent"
            //size="lg"
            sx={(theme) => ({
                //backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6]
            })}
            onClick={() => toggleColorScheme()}
        >
            {colorScheme === "dark" ? <Sun size={18} /> : <MoonStars size={18} />}
        </ActionIcon>
    );
}
