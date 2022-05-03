import { createStyles, Container, Title, Stepper, useMantineTheme } from "@mantine/core";
import { BrandTelegram, Urgent, Engine, Browser, Briefcase, Robot } from "tabler-icons-react";

const items = [
    {
        title: "2017",
        text: "Public Trading Signals",
        icon: <Urgent size={20} />
    },
    {
        title: "2018",
        text: "Trading Engine",
        icon: <Engine size={20} />
    },
    {
        title: "2019",
        text: "Trading Telegram Bot",
        icon: <BrandTelegram size={20} />
    },

    {
        title: "2021",
        text: "Portfolio management",
        icon: <Briefcase size={20} />
    },
    {
        title: "2022",
        text: "Trading Web App",
        icon: <Browser size={20} />
    },
    {
        title: "2023",
        text: "More Coins and Robots",
        icon: <Robot size={20} />
    }
];

const useStyles = createStyles((theme, params, getRef) => {
    return {
        wrapper: {
            paddingTop: theme.spacing.xl * 2
        },
        inner: {
            display: "flex",

            justifyContent: "center"
        },
        title: {
            fontWeight: 900,
            marginBottom: theme.spacing.xl * 1.5
        },
        stepper: {
            marginTop: `${theme.spacing.xl * 3}px`,
            marginBottom: `${theme.spacing.xl * 5}px`
        },

        separatorActive: {
            borderWidth: 0,
            backgroundImage: theme.fn.linearGradient(45, theme.colors[theme.primaryColor][6], theme.colors.cyan[6])
        },
        stepProgress: {
            transform: "scale(1.05)",

            [`& .${getRef("stepIcon")}`]: {}
        },

        stepCompleted: {
            [`& .${getRef("stepIcon")}`]: {
                borderWidth: 0,
                backgroundColor: "transparent",
                backgroundImage: theme.fn.linearGradient(45, theme.colors[theme.primaryColor][6], theme.colors.cyan[6])
            }
        }
    };
});

export function Roadmap() {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    return (
        <Container size="xl" id="roadmap" className={classes.wrapper}>
            <Title align="center" className={classes.title}>
                Roadmap
            </Title>
            <div className={classes.inner}>
                <Stepper
                    size="md"
                    active={4}
                    breakpoint="lg"
                    color={theme.primaryColor}
                    className={classes.stepper}
                    classNames={{
                        separatorActive: classes.separatorActive,
                        stepProgress: classes.stepProgress,
                        stepCompleted: classes.stepCompleted
                    }}
                >
                    {items.map(({ title, text, icon }) => (
                        <Stepper.Step key={title} label={title} description={text} icon={icon} completedIcon={icon} />
                    ))}
                </Stepper>
            </div>
        </Container>
    );
}
