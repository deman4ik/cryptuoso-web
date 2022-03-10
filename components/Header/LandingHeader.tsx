import { Button, Container, Grid, Group, Header, Space, Text, useMantineColorScheme } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ColorSchemeToggle } from "../Button/ColorSchemeToggle";
import { LinkButton } from "../Button/LinkButton";
import { Logo } from "../Images/Logo";
import { TextLink } from "../Link/TextLink";

export function LandingHeader() {
    const { data: session } = useSession();
    return (
        <Header height={60} fixed>
            <Container size="xl" sx={{ height: "100%" }}>
                <Grid grow justify="space-between" align="center" gutter="xs" sx={{ height: "100%" }}>
                    <Grid.Col span={4} sx={{ paddingBottom: 0 }}>
                        <Group spacing="xl">
                            <Logo href="/" />

                            <TextLink href="/" transform="uppercase">
                                Cryptuoso
                            </TextLink>

                            <TextLink href="/auth/signin" transform="uppercase">
                                Docs
                            </TextLink>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={2} sx={{ paddingBottom: 0 }}>
                        <Group position="right" spacing="xl">
                            {session ? (
                                <>
                                    <TextLink
                                        href="/app/trading"
                                        transform="uppercase"
                                        variant="gradient"
                                        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                                    >
                                        TRADING
                                    </TextLink>
                                    <TextLink onClick={() => signOut()} transform="uppercase">
                                        SIGN OUT
                                    </TextLink>
                                </>
                            ) : (
                                <TextLink href="/auth/signin" transform="uppercase">
                                    SIGN IN
                                </TextLink>
                            )}
                            <ColorSchemeToggle />
                        </Group>
                    </Grid.Col>
                </Grid>
            </Container>
        </Header>
    );
}
