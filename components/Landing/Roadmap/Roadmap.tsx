import { Timeline, Text, createStyles, Container, Title } from "@mantine/core";
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
        title: "2020",
        text: "Trading Web App",
        icon: <Browser size={20} />
    },
    {
        title: "2021",
        text: "Portfolio management",
        icon: <Briefcase size={20} />
    },
    {
        title: "2022",
        text: "More Robots",
        icon: <Robot size={20} />
    }
];

const useStyles = createStyles((theme) => {
    return {
        title: {
            fontWeight: 900,
            marginBottom: theme.spacing.xl * 1.5
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
            <Timeline active={4} bulletSize={26} lineWidth={4}>
                {items.map(({ title, text, icon }) => (
                    <Timeline.Item
                        bullet={icon}
                        title={title}
                        key={title}
                        lineVariant={title === "2021" ? "dotted" : "solid"}
                    >
                        <Text color="dimmed" size="md">
                            {text}
                        </Text>
                    </Timeline.Item>
                ))}
            </Timeline>
        </Container>
    );
}
