import React from "react";
import { ActionIcon, SegmentedControl, Group, Center, Box, useMantineColorScheme } from "@mantine/core";
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
                color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.indigo[6]
            })}
            onClick={() => toggleColorScheme()}
        >
            {colorScheme === "dark" ? <Sun size={18} /> : <MoonStars size={18} />}
        </ActionIcon>
    );
}

export function ColorSchemeToggleBig({ ...others }) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <Group {...others} position="center" my="xl" grow>
            <SegmentedControl
                sx={(theme) => ({
                    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1]
                })}
                value={colorScheme}
                onChange={toggleColorScheme as (value: string) => void}
                data={[
                    {
                        value: "light",
                        label: (
                            <Center>
                                <Sun size={16} />
                                <Box ml={10}>Light</Box>
                            </Center>
                        )
                    },
                    {
                        value: "dark",
                        label: (
                            <Center>
                                <MoonStars size={16} />
                                <Box ml={10}>Dark</Box>
                            </Center>
                        )
                    }
                ]}
            />
        </Group>
    );
}
