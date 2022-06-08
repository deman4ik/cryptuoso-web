import { Stack, Stepper, Container } from "@mantine/core";
import { useState } from "react";
import { ExchangeAccountForm } from "@cryptuoso/components/App/ExchangeAccount";

export function GettingStarted() {
    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    return (
        <Container>
            <Stepper active={active} breakpoint="sm">
                <Stepper.Step label="API Keys" description="Create Exchange Account">
                    <ExchangeAccountForm onSuccess={nextStep} />
                </Stepper.Step>
                <Stepper.Step label="Subscribe" description="Create subscriptions">
                    Step 2 content: Verify email
                </Stepper.Step>
                <Stepper.Step label="Portfolio" description="Configure your portfolio">
                    Step 3 content: Get full access
                </Stepper.Step>
            </Stepper>
        </Container>
    );
}
