import Head from "next/head";
import { createStyles } from "@mantine/core";
import { withUrqlClient } from "next-urql";
import { LandingHeader, LandingFooter, footerLinks, headerLinks } from "@cryptuoso/components/Landing/Layout";
import { Hero } from "@cryptuoso/components/Landing/Hero";
import { FeaturesGrid } from "@cryptuoso/components/Landing/Features";
import { FAQ } from "@cryptuoso/components/Landing/FAQ";
import { About } from "@cryptuoso/components/Landing/About";
import { Roadmap } from "@cryptuoso/components/Landing/Roadmap";
import { Portfolios } from "@cryptuoso/components/Landing/Portfolios";
import { TelegramBot } from "@cryptuoso/components/Landing/TelegramBot";
import { Pricing } from "@cryptuoso/components/Landing/Pricing";
import { Exchanges } from "@cryptuoso/components/Landing/Exchanges";

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column"
    },
    darkBg: {
        //backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
        backgroundImage:
            theme.colorScheme === "dark"
                ? theme.fn.linearGradient(360, theme.colors.dark[7], theme.colors.dark[6], theme.colors.dark[7])
                : theme.fn.linearGradient(360, theme.colors.gray[0], theme.colors.gray[1], theme.colors.gray[0])
    },
    gradientBg: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        backgroundImage: `radial-gradient(at 70% 70%, ${theme.colors.indigo[9]} 0px, transparent 50%),
        radial-gradient(at 15% 35%, ${theme.colors.cyan[9]} 0px, transparent 50%);`
    }
}));

function HomePage() {
    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <Head>
                <title>CRYPTUOSO - Cryptocurrency trading automation</title>
            </Head>
            <LandingHeader links={headerLinks} />
            <div className={classes.darkBg}>
                <Hero />
            </div>
            <FeaturesGrid />

            <Exchanges />

            <div className={classes.darkBg}>
                <Portfolios />
            </div>

            <TelegramBot />

            <div className={classes.darkBg}>
                <Pricing />
            </div>

            <About />
            <Roadmap />

            <div className={classes.darkBg}>
                <FAQ />
            </div>
            <LandingFooter links={footerLinks} />
        </div>
    );
}

export default withUrqlClient((_ssrExchange, ctx) => ({
    url: `${process.env.NEXT_PUBLIC_HASURA_URL}`
}))(HomePage);
