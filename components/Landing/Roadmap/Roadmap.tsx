import { createStyles, Container, Title, Stepper } from "@mantine/core";
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
            display: "flex",

            justifyContent: "center"
        },
        title: {
            fontWeight: 900,
            marginBottom: theme.spacing.xl * 1.5
        },
        inner: {
            marginTop: `${theme.spacing.xl * 3}px`,
            marginBottom: `${theme.spacing.xl * 5}px`
        },

        separatorActive: {
            borderWidth: 0,
            backgroundImage: theme.fn.linearGradient(45, theme.colors.blue[6], theme.colors.cyan[6])
        },
        stepProgress: {
            transform: "scale(1.05)",

            [`& .${getRef("stepIcon")}`]: {}
        },

        stepCompleted: {
            [`& .${getRef("stepIcon")}`]: {
                borderWidth: 0,
                backgroundColor: "transparent",
                backgroundImage: theme.fn.linearGradient(45, theme.colors.blue[6], theme.colors.cyan[6])
            }
        }
    };
});

export function Roadmap() {
    const { classes } = useStyles();
    return (
        <Container size="xl" my="xl" id="roadmap">
            <Title align="center" className={classes.title}>
                Roadmap
            </Title>
            <div className={classes.wrapper}>
                <Stepper
                    size="md"
                    active={4}
                    breakpoint="lg"
                    className={classes.inner}
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
