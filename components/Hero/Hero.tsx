import { Box, Text, Title, Anchor, Group } from "@mantine/core";
import Image from "next/image";

export function Hero() {
    return (
        <Box>
            <Group>
                <Title sx={{ fontSize: 100, fontWeight: 900, letterSpacing: -2 }} align="center" mt={100}>
                    Welcome to{" "}
                    <Text inherit variant="gradient" component="span">
                        Mantine
                    </Text>
                </Title>
                <Text color="dimmed" align="center" size="lg" sx={{ maxWidth: 580 }} mx="auto" mt="xl">
                    This starter Next.js projects includes a minimal setup for server side rendering, if you want to
                    learn more on Mantine + Next.js integration follow{" "}
                    <Anchor href="https://mantine.dev/theming/next/" size="lg">
                        this guide
                    </Anchor>
                    . To get started edit index.tsx file.
                </Text>
            </Group>
        </Box>
    );
}
