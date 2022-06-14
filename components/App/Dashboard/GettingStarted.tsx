import { Stack, Stepper, Container, Paper, Group, SimpleGrid } from "@mantine/core";
import { useState } from "react";
import { ExchangeAccountForm } from "@cryptuoso/components/App/ExchangeAccount";
import { ChooseSubForm, SubscriptionCard } from "@cryptuoso/components/App/Subscription";

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
    portfolioExists
}: {
    userExAccExists: boolean;
    userSubExists: boolean;
    userSubActive: boolean;
    userPaymentExists: boolean;
    portfolioExists: boolean;
}) {
    const [active, setActive] = useState(
        initialStep(userExAccExists, userSubExists, userSubActive, userPaymentExists, portfolioExists)
    );
    const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
    return (
        <Container mt="xs">
            <Stepper active={active} breakpoint="sm">
                <Stepper.Step label="API Keys" description="Create Exchange Account">
                    <ExchangeAccountForm onSuccess={nextStep} />
                </Stepper.Step>
                <Stepper.Step label="Subscribe" description="Create subscription">
                    <ChooseSubForm onSuccess={nextStep} />
                </Stepper.Step>
                <Stepper.Step label="Checkout" description="Make payment">
                    <SubscriptionCard sx={{ width: "100%" }} onSuccess={nextStep} />
                </Stepper.Step>
                <Stepper.Step label="Portfolio" description="Configure your portfolio">
                    Step 3 content: Get full access
                </Stepper.Step>
            </Stepper>
        </Container>
    );
}
