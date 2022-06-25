import { Stack, Stepper, Container, Paper, Group, SimpleGrid } from "@mantine/core";
import { useState } from "react";
import { ExchangeAccountForm } from "@cryptuoso/components/App/ExchangeAccount";
import { ChooseSubForm, SubscriptionCard } from "@cryptuoso/components/App/Subscription";
import { CreateUserPortfolio } from "../Portfolio";
import { BaseCard, CardHeader } from "../Card";

function initialStep(
    userExAccExists: boolean,
    userSubExists: boolean,
    userSubActive: boolean,
    userPaymentExists: boolean,
    portfolioExists: boolean
) {
    if (!userExAccExists && !userSubExists && !portfolioExists) {
        return 0;
    } else if (userExAccExists && !userSubExists && !portfolioExists) {
        return 1;
    } else if (userExAccExists && userSubExists && !userSubActive && !userPaymentExists && !portfolioExists) {
        return 2;
    }
    return 3;
}

export function GettingStarted({
    userExAccExists,
    userSubExists,
    userSubActive,
    userPaymentExists,
    portfolioExists,
    refetch
}: {
    userExAccExists: boolean;
    userSubExists: boolean;
    userSubActive: boolean;
    userPaymentExists: boolean;
    portfolioExists: boolean;
    refetch: () => void;
}) {
    const [active, setActive] = useState(
        1 || initialStep(userExAccExists, userSubExists, userSubActive, userPaymentExists, portfolioExists)
    );
    const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
    return (
        <Container mt="xs" size="xl">
            <Stepper active={active} breakpoint="sm">
                <Stepper.Step label="API Keys" description="Create Exchange Account">
                    <BaseCard justify="flex-start">
                        <CardHeader title="Create Exchange Account" />
                        <ExchangeAccountForm onSuccess={nextStep} />
                    </BaseCard>
                </Stepper.Step>
                <Stepper.Step label="Subscribe" description="Create subscription">
                    <BaseCard justify="flex-start">
                        <CardHeader title="Create subscription" />
                        <ChooseSubForm onSuccess={nextStep} />
                    </BaseCard>
                </Stepper.Step>
                <Stepper.Step label="Checkout" description="Make payment">
                    <SubscriptionCard sx={{ width: "100%" }} onSuccess={nextStep} />
                </Stepper.Step>
                <Stepper.Step label="Portfolio" description="Configure your portfolio">
                    <CreateUserPortfolio onSuccess={refetch} />
                </Stepper.Step>
            </Stepper>
        </Container>
    );
}
