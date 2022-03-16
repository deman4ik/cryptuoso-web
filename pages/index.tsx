import { createStyles } from "@mantine/core";
import { LandingHeader } from "../components/Header/LandingHeader";
import { footerLinks, headerLinks } from "../components/Layout/Layout";
import { Hero } from "../components/Landing/Hero/Hero";
import { LandingFooter } from "../components/Footer/LandingFooter";
import { FeaturesGrid } from "../components/Landing/Features/Features";
import { FAQ } from "../components/Landing/FAQ/FAQ";
import { About } from "../components/Landing/About/About";

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
            <LandingHeader links={headerLinks} />
            <Hero />

            <FeaturesGrid />
            <About />
            <div className={classes.darkBg}>
                <FAQ />
            </div>

            <LandingFooter links={footerLinks} />
        </div>
    );
}
