import React, { useState } from "react";
import {
    Container,
    Title,
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
    Button,
    useMantineTheme
} from "@mantine/core";
import { gql, useQuery } from "urql";
import { SimpleLink } from "@cryptuoso/components/Link";
import { Briefcase, LockAccess, ReceiptTax, SettingsAutomation, ManualGearbox } from "tabler-icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { features, freeOption, Option, paidFeatures } from "@cryptuoso/helpers/pricing";

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
        fromColor: "orange",
        toColor: "yellow"
    }
];

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
    if (error) console.error(error);

    const currentFeatures = option?.code === "free" ? freeFeatures : paidFeatures;
    const items = [...currentFeatures, ...features].map((feature) => (
        <div key={feature.title}>
            <ThemeIcon
                size={44}
                radius="sm"
                variant="gradient"
                gradient={{ from: feature.fromColor, to: feature.toColor, deg: 45 }}
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
                Pay with{" "}
                <Anchor href="/docs/subscription" target="_blank">
                    Crypto
                </Anchor>
                !
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
