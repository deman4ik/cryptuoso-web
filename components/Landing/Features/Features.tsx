import React from "react";
import {
    ThemeIcon,
    Text,
    Title,
    Container,
    SimpleGrid,
    useMantineTheme,
    createStyles,
    Mark,
    Group,
    DefaultMantineColor,
    Box
} from "@mantine/core";
import { Icon as TablerIcon } from "tabler-icons-react";
import { SettingsAutomation, Gauge, Briefcase, Cloud, Bulb, Lock } from "tabler-icons-react";

export const DATA = [
    {
        icon: SettingsAutomation,
        title: "Automatic Trading",
        description:
            "Robots execute all deals for you, so you only need to keep track of the current positions and your trading performance.",
        color: "indigo"
    },
    {
        icon: Briefcase,
        title: "Portfolio management",
        description:
            "We combine our robots into profitable portfolios to maximize profit and to minimize potential drawdown.",
        color: "cyan"
    },
    {
        icon: Cloud,
        title: "Reliable",
        description:
            "Robots are cloud-based and do not require installation of software on your computer. Any trade will never be missed.",
        color: "blue"
    },
    {
        icon: Gauge,
        title: "Instant",
        description: "Robots instantly react to market fluctuations and execute orders faster than human could.",
        color: "green"
    },
    {
        icon: Lock,
        title: "Secure",
        description:
            "Our robots use customizable API exchange keys, which allow to make deals, but not to manage your account. We store your keys in a secure, encrypted storage.",
        color: "red"
    },
    {
        icon: Bulb,
        title: "Simple",
        description:
            "Just add your exchange account and subscribe to robots for transactions. Complete a few steps and you are done.",
        color: "yellow"
    }
];

interface FeatureProps {
    icon: TablerIcon;
    title: React.ReactNode;
    description: React.ReactNode;
    color: DefaultMantineColor;
    className: string;
}

export function Feature({ icon: Icon, title, description, color, className }: FeatureProps) {
    const theme = useMantineTheme();
    return (
        <Box>
            <ThemeIcon variant="light" size={50} radius={40} color={color} className={className}>
                <Icon style={{ width: 30, height: 30 }} />
            </ThemeIcon>
            <Text
                variant="gradient"
                gradient={{ from: color, to: "blue", deg: 45 }}
                style={{ marginTop: theme.spacing.sm, marginBottom: 7 }}
                size="lg"
            >
                {title}
            </Text>
            <Text size="md" color="dimmed" style={{ lineHeight: 1.6 }}>
                {description}
            </Text>
        </Box>
    );
}

const useStyles = createStyles((theme) => ({
    wrapper: {
        paddingTop: 60,
        paddingBottom: theme.spacing.xl * 2
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 900,
        marginBottom: theme.spacing.md,
        textAlign: "center",

        [theme.fn.smallerThan("sm")]: {
            fontSize: 28,
            textAlign: "left"
        }
    },

    description: {
        textAlign: "center",

        [theme.fn.smallerThan("sm")]: {
            textAlign: "left"
        }
    },

    feature: {
        "&:hover": {
            transform: "scale(1.1)"
        }
    }
}));

export function FeaturesGrid() {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const features = DATA.map((feature, index) => <Feature {...feature} key={index} className={classes.feature} />);

    return (
        <Container className={classes.wrapper} id="features">
            <Title className={classes.title}>
                Still trading manually and constantly watching news, trying to catch the trend?{" "}
            </Title>
            <Title className={classes.title}>
                Following the exchange rates{" "}
                <Text variant="gradient" gradient={{ from: "orange", to: "yellow", deg: 45 }} inherit component="span">
                    day
                </Text>{" "}
                and{" "}
                <Text variant="gradient" gradient={{ from: "indigo", to: "violet", deg: 45 }} inherit component="span">
                    night
                </Text>
                ?
            </Title>

            <Group>
                <Text size="xl" className={classes.description}>
                    Cryptuoso provides automated cryptocurrency trading robots built on carefully tested trading
                    algorithms.
                </Text>
                <Text size="xl" className={classes.description}>
                    Trading robots make money on both{" "}
                    <Text variant="gradient" gradient={{ from: "teal", to: "lime", deg: 45 }} inherit component="span">
                        rising
                    </Text>{" "}
                    and{" "}
                    <Text variant="gradient" gradient={{ from: "red", to: "orange", deg: 45 }} inherit component="span">
                        falling
                    </Text>{" "}
                    of cryptocurrency prices. The more volatile the market - the more opportunities for the robots.
                </Text>
                <Text size="xl" className={classes.description}>
                    Robots instantly respond to cryptocurrency market fluctuations and generate trading signals that are
                    safely transmitted to chosen cryptocurrency exchange on your behalf.
                </Text>
            </Group>

            <SimpleGrid
                mt={60}
                cols={3}
                spacing={theme.spacing.xl * 2}
                breakpoints={[
                    { maxWidth: 980, cols: 2, spacing: "xl" },
                    { maxWidth: 755, cols: 1, spacing: "xl" }
                ]}
            >
                {features}
            </SimpleGrid>
        </Container>
    );
}
