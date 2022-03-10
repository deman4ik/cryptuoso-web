import { Title, Text, Anchor, List, Container, Button } from "@mantine/core";
import { useQuery, gql } from "urql";
import { useSession, signIn, signOut } from "next-auth/react";
import { LandingHeader } from "../components/Header/LandingHeader";
import { Layout } from "../components/Layout/Layout";
import { Hero } from "../components/Hero/Hero";

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
        <Layout>
            <Hero />

            {session ? (
                <>
                    <Text>Signed in as {session?.user?.email}</Text>
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
        </Layout>
    );
}
