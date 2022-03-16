import { Title, Text, Anchor, List, Container, Button, createStyles } from "@mantine/core";
import { useQuery, gql } from "urql";
import { useSession, signIn, signOut } from "next-auth/react";
import { LandingHeader } from "../components/Header/LandingHeader";
import { footerLinks, headerLinks, Layout } from "../components/Layout/Layout";
import { Hero } from "../components/Landing/Hero/Hero";
import { LandingFooter } from "../components/Footer/LandingFooter";
import { FeaturesGrid } from "../components/Landing/Features/Features";
import { FAQ } from "../components/Landing/FAQ/FAQ";

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column"
    },
    darkBg: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white
    }
}));
export default function HomePage() {
    const { data: session } = useSession();
    const { classes } = useStyles();

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
        <div className={classes.root}>
            <LandingHeader links={headerLinks} />
            <Hero />

            <FeaturesGrid />
            <div className={classes.darkBg}>
                <FAQ />
            </div>
            <LandingFooter links={footerLinks} />
        </div>
    );
}
