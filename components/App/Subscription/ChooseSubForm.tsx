import { useState } from "react";
import { gql, useMutation, useQuery } from "urql";
import { features, Option, paidFeatures } from "@cryptuoso/helpers/pricing";
import {
    Anchor,
    Button,
    createStyles,
    Grid,
    LoadingOverlay,
    Paper,
    SegmentedControl,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    ThemeIcon,
    useMantineTheme
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { SimpleLink } from "@cryptuoso/components/Link";

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

export function ChooseSubForm({ onSuccess }: { onSuccess: () => void }) {
    const smallScreen = useMediaQuery("(max-width:576px)");
    const theme = useMantineTheme();
    const { classes } = useStyles();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [value, setValue] = useState("6m");

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
                    subscriptionId: subscription_id
                }
            }
        `
    });
    const { data, fetching, error: queryError } = result;
    const options: Option[] = data?.options || [];
    const option = options?.find((option) => option.code === value);
    if (queryError) console.error(queryError);

    const items = [...paidFeatures, ...features].map((feature) => (
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
            <Text color="dimmed" size="sm" weight={500}>
                {feature.description}
            </Text>
        </div>
    ));

    const [, userSubCreate] = useMutation<
        { result: { id: string } },
        {
            subscriptionId?: string;
            subscriptionOption?: string;
        }
    >(
        gql`
            mutation userSubCreate($subscriptionId: uuid!, $subscriptionOption: String!) {
                result: userSubCreate(subscriptionId: $subscriptionId, subscriptionOption: $subscriptionOption) {
                    id
                }
            }
        `
    );

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const result = await userSubCreate({
            subscriptionId: option?.subscriptionId,
            subscriptionOption: option?.code
        });

        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result?.id) {
            if (onSuccess) {
                onSuccess();
            } else {
                setLoading(false);
            }
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <LoadingOverlay visible={fetching || loading} />

            {options && options.length ? (
                <Stack mt="md">
                    <Text align="center" size="sm" color="dimmed" weight={500}>
                        Choose your subscription period and pay with Crypto.{" "}
                        <Anchor href="/docs/subscription" target="_blank" size="sm" weight={500}>
                            Learn details
                        </Anchor>
                    </Text>
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

                    <Grid grow gutter="xl" align="center" justify="space-between">
                        <Grid.Col span={12} sm={4}>
                            <Stack>
                                <Stack className={classes.priceTotalBox}>
                                    {option?.discount && (
                                        <>
                                            <Text align="center" size="lg" weight={900}>
                                                ${option?.priceTotal}
                                            </Text>
                                            <Text align="center" color="dimmed" size="md" mt={-20} weight={500}>
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
                                <Text align="center" color="dimmed" size="lg" mt={-25} weight={500}>
                                    per month
                                </Text>
                                {error && (
                                    <Text color="red" size="sm" mt="sm" weight={500}>
                                        {error}
                                    </Text>
                                )}
                                <Button
                                    onClick={handleSubmit}
                                    size="md"
                                    variant="gradient"
                                    gradient={{ from: theme.primaryColor, to: "cyan", deg: 45 }}
                                >
                                    Subscribe
                                </Button>
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={12} sm={8}>
                            <SimpleGrid cols={2} spacing={40} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
                                {items}
                            </SimpleGrid>
                        </Grid.Col>
                    </Grid>
                </Stack>
            ) : (
                <Stack mt="md">
                    <Skeleton height={50} width="100%" />
                    <Grid grow gutter="xl" align="center" mt="lg" justify="space-between">
                        <Grid.Col span={4}>
                            <Skeleton height={200} />
                        </Grid.Col>
                        <Grid.Col span={8}>
                            <Skeleton height={200} />
                        </Grid.Col>
                    </Grid>
                </Stack>
            )}
        </div>
    );
}
