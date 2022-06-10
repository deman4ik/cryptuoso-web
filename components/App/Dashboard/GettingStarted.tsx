import { Stack, Stepper, Container, Paper } from "@mantine/core";
import { useState } from "react";
import { ExchangeAccountForm } from "@cryptuoso/components/App/ExchangeAccount";
import { CheckoutForm, ChooseSubForm } from "@cryptuoso/components/App/Subscription";

function initialStep(
    userExAccExists: boolean,
    userSubExists: boolean,
    userPaymentExists: boolean,
    portfolioExists: boolean
) {
    if (!userExAccExists && !userSubExists && !portfolioExists) {
        return 0;
    } else if (userExAccExists && !userSubExists && !portfolioExists) {
        return 1;
    } else if (userExAccExists && userSubExists && !userPaymentExists && !portfolioExists) {
        return 2;
    }
    return 3;
}

export function GettingStarted({
    userExAccExists,
    userSubExists,
    userPaymentExists,
    portfolioExists
}: {
    userExAccExists: boolean;
    userSubExists: boolean;
    userPaymentExists: boolean;
    portfolioExists: boolean;
}) {
    const [active, setActive] = useState(
        initialStep(userExAccExists, userSubExists, userPaymentExists, portfolioExists)
    );
    const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
    return (
        <Container mt="xs">
            <Paper shadow="md" p={20} radius="md">
                <Stepper active={active} breakpoint="sm">
                    <Stepper.Step label="API Keys" description="Create Exchange Account">
                        <ExchangeAccountForm onSuccess={nextStep} />
                    </Stepper.Step>
                    <Stepper.Step label="Subscribe" description="Create subscription">
                        <ChooseSubForm onSuccess={nextStep} />
                    </Stepper.Step>
                    <Stepper.Step label="Checkout" description="Make payment">
                        <CheckoutForm onSuccess={nextStep} />
                    </Stepper.Step>
                    <Stepper.Step label="Portfolio" description="Configure your portfolio">
                        Step 3 content: Get full access
                    </Stepper.Step>
                </Stepper>
            </Paper>
        </Container>
    );
}
