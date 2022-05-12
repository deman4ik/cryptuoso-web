import React, { useState } from "react";
import {
    Container,
    Title,
    Accordion,
    createStyles,
    Grid,
    Text,
    SegmentedControl,
    Center,
    LoadingOverlay,
    Stack,
    Anchor,
    ThemeIcon,
    SimpleGrid,
    Paper,
    Button,
    Box,
    useMantineTheme,
    Card
} from "@mantine/core";
import { gql, useQuery } from "urql";
import { SimpleLink } from "@cryptuoso/components/Link/SimpleLink";
import { Briefcase, LockAccess, ReceiptTax, SettingsAutomation, ManualGearbox } from "tabler-icons-react";
import { useMediaQuery } from "@mantine/hooks";

const useStyles = createStyles((theme) => {
    return {
        wrapper: {
            position: "relative",
            paddingTop: theme.spacing.xl * 2,
            paddingBottom: theme.spacing.xl * 2,
            minHeight: 650
        },

        title: {
            fontWeight: 900,
            marginBottom: theme.spacing.xl * 1.5
        },
        price: {
            fontSize: 34
        },
        priceTotalBox: {
            minHeight: 50
        },
        controlActive: {
            backgroundColor: "transparent",
            backgroundImage: theme.fn.linearGradient(45, theme.colors[theme.primaryColor][9], theme.colors.cyan[9])
        }
    };
});

const freeFeatures = [
    {
        icon: ManualGearbox,
        title: "Manual",
        description: "Traid manually using free signals published to Telegram Channel.",
        color: "yellow"
    }
];
const paidFeatures = [
    {
        icon: SettingsAutomation,
        title: "Automated",
        description: "Fully automated trading on a pull of 200+ robots. Start and forget.",
        color: "indigo"
    }
];

const features = [
    {
        icon: LockAccess,
        title: "No Limits",
        description: "Unlimited positions & deals. Unlimited trading volume.",
        color: "red"
    },
    {
        icon: ReceiptTax,
        title: "No fees",
        description: "No additional fees on your trades. Fixed subscription pricing.",
        color: "green"
    },
    {
        icon: Briefcase,
        title: "Portfolio",
        description: "Automated portfolio rebalancing and performance analysis.",
        color: "cyan"
    }
];

interface Option {
    code: string;
    name: string;
    priceMonth: number;
    priceTotal: number;
    discount: number | null;
    highlight: boolean;
}

const freeOption: Option = {
    code: "free",
    name: "Free Plan",
    priceMonth: 0,
    priceTotal: 0,
    discount: null,
    highlight: false
};

export function Pricing() {
    const theme = useMantineTheme();
    const [value, setValue] = useState("6m");
    const { classes } = useStyles();

    const [result] = useQuery<{
        options: Option[];
    }>({
        query: gql`
            query PricingOptions {
                options: subscription_options {
                    code
                    name
                    priceMonth: price_month
                    priceTotal: price_total
                    discount
                    highlight
                }
            }
        `
    });
    const { data, fetching, error } = result;
    const options = [freeOption, ...(data?.options || [])];
    const option = options?.find((option) => option.code === value);
    console.log(options);
    if (error) console.error(error);

    const currentFeatures = option?.code === "free" ? freeFeatures : paidFeatures;
    const items = [...currentFeatures, ...features].map((feature) => (
        <div key={feature.title}>
            <ThemeIcon
                size={44}
                radius="md"
                variant="gradient"
                gradient={{ from: feature.color, to: "dark", deg: 180 }}
            >
                <feature.icon size={26} />
            </ThemeIcon>
            <Text size="lg" mt="sm" weight={500}>
                {feature.title}
            </Text>
            <Text color="dimmed" size="sm">
                {feature.description}
            </Text>
        </div>
    ));
    const smallScreen = useMediaQuery("(max-width:576px)");
    return (
        <Container size="md" className={classes.wrapper} id="pricing">
            <Title align="center" className={classes.title}>
                Pricing
            </Title>

            <Text size="lg" align="center" color="dimmed">
                Get access to all the available features at a single, affordable price.
            </Text>
            <Text size="md" align="center">
                Pay with <Anchor href="https://commerce.coinbase.com/faq">Crypto</Anchor>!
            </Text>
            {error && <Text color="red">{error.message}</Text>}
            <LoadingOverlay visible={fetching} />
            {options && options.length && (
                <Center mt="xl">
                    <Stack>
                        <SegmentedControl
                            value={value}
                            onChange={setValue}
                            data={options.map(({ code, name }) => ({ label: name, value: code }))}
                            size={smallScreen ? "sm" : "lg"}
                            color={theme.primaryColor}
                            transitionDuration={500}
                            transitionTimingFunction="linear"
                            classNames={{ controlActive: classes.controlActive }}
                        />

                        <Grid grow gutter="xl" align="center" mt="lg" justify="space-between">
                            <Grid.Col span={4}>
                                <Stack>
                                    <Stack className={classes.priceTotalBox}>
                                        {option?.discount && (
                                            <>
                                                <Text align="center" size="lg" weight={900}>
                                                    ${option?.priceTotal}
                                                </Text>
                                                <Text align="center" color="dimmed" size="md" mt={-20}>
                                                    for {option?.name}
                                                </Text>
                                            </>
                                        )}
                                    </Stack>

                                    <Text
                                        align="center"
                                        variant="gradient"
                                        gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                        size="xl"
                                        weight={900}
                                        className={classes.price}
                                    >
                                        ${option?.priceMonth}
                                    </Text>
                                    <Text align="center" color="dimmed" size="lg" mt={-25}>
                                        per month
                                    </Text>

                                    <Button
                                        component={SimpleLink}
                                        href={
                                            option?.code === "free"
                                                ? "https://t.me/cryptuoso"
                                                : "https://t.me/cryptuoso_bot"
                                        }
                                        size="md"
                                        variant="gradient"
                                        gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                    >
                                        Subscribe
                                    </Button>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <SimpleGrid cols={2} spacing={40} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
                                    {items}
                                </SimpleGrid>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Center>
            )}
        </Container>
    );
}
