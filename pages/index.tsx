import Head from "next/head";
import { createStyles } from "@mantine/core";
import { LandingHeader } from "@cryptuoso/components/Landing/Layout/Header";
import { footerLinks, headerLinks } from "@cryptuoso/components/Landing/Layout/Layout";
import { Hero } from "@cryptuoso/components/Landing/Hero/Hero";
import { LandingFooter } from "@cryptuoso/components/Landing/Layout/Footer";
import { FeaturesGrid } from "@cryptuoso/components/Landing/Features/Features";
import { FAQ } from "@cryptuoso/components/Landing/FAQ/FAQ";
import { About } from "@cryptuoso/components/Landing/About/About";
import { Roadmap } from "@cryptuoso/components/Landing/Roadmap/Roadmap";
import { Portfolios } from "@cryptuoso/components/Landing/Portfolios/Portfolios";
import { TelegramBot } from "@cryptuoso/components/Landing/TelegramBot/TelegramBot";

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
    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <Head>
                <title>CRYPTUOSO - Cryptocurrency trading automation</title>
            </Head>
            <LandingHeader links={headerLinks} />
            <Hero />

            <FeaturesGrid />
            <div className={classes.darkBg}>
                <Portfolios />
            </div>
            <TelegramBot />
            <About />
            <Roadmap />
            <div className={classes.darkBg}>
                <FAQ />
            </div>

            <LandingFooter links={footerLinks} />
        </div>
    );
}
