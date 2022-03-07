import { Title, Text, Anchor, List, Container, Button } from "@mantine/core";
import { useQuery, gql } from "urql";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
    const { data: session } = useSession();

    const [result] = useQuery<{ robots: { id: string; code: string }[] }>({
        query: gql`
            query robots {
                robots {
                    id
                    code
                }
            }
        `
    });

    const { data, fetching, error } = result;
    if (fetching)
        return (
            <Text color="dimmed" align="center" size="lg" sx={{ maxWidth: 580 }} mx="auto" mt="xl">
                Loading...
            </Text>
        );
    if (error)
        return (
            <Text color="dimmed" align="center" size="lg" sx={{ maxWidth: 580 }} mx="auto" mt="xl">
                Oh no... {error.message}
            </Text>
        );
    return (
        <>
            <Container>
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

                {session ? (
                    <>
                        Signed in as {JSON.stringify(session)} <br />
                        <Button onClick={() => signOut()}>Sign out</Button>
                    </>
                ) : (
                    <>
                        Not signed in <br />
                        <Button onClick={() => signIn()}>Sign in</Button>
                    </>
                )}

                <Text color="dimmed" align="center" size="lg" sx={{ maxWidth: 580 }} mx="auto" mt="xl">
                    Robots:
                </Text>
                <List>
                    {data?.robots.map(({ id, code }) => (
                        <List.Item key={id}>{code}</List.Item>
                    ))}
                </List>
            </Container>
        </>
    );
}
