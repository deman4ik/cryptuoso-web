import { UserPortfolio } from "@cryptuoso/types";
import { Button, Group, Stack, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { BoxMultiple, Calculator } from "tabler-icons-react";
import { TradingAmountFormControls } from "../controls";
import { ChangeOptionsForm } from "./ChangeOptionsForm";
import { ChangeTradingAmountForm } from "./ChangeTradingAmountForm";

export function EditPortfolio({
    onSuccess,
    onCancel,
    userPortfolio
}: {
    onSuccess: () => void;
    onCancel: () => void;
    userPortfolio?: UserPortfolio;
}) {
    const [mode, setMode] = useState<"edit" | "amount" | "options">("edit");
    const theme = useMantineTheme();
    return (
        <Stack>
            {mode === "edit" && (
                <Stack my="xl" mx="sm">
                    <Button
                        fullWidth
                        size="lg"
                        variant="gradient"
                        gradient={{ from: theme.primaryColor, to: "grape", deg: 45 }}
                        rightIcon={<BoxMultiple size={24} />}
                        onClick={() => setMode("options")}
                    >
                        Change portfolio options
                    </Button>
                    <Button
                        fullWidth
                        size="lg"
                        variant="gradient"
                        gradient={{ from: theme.primaryColor, to: "violet", deg: 45 }}
                        rightIcon={<Calculator size={24} />}
                        onClick={() => setMode("amount")}
                    >
                        Change trading amount
                    </Button>
                </Stack>
            )}

            {mode === "amount" && (
                <ChangeTradingAmountForm onSuccess={onSuccess} onCancel={onCancel} userPortfolio={userPortfolio} />
            )}

            {mode === "options" && (
                <ChangeOptionsForm onSuccess={onSuccess} onCancel={onCancel} userPortfolio={userPortfolio} />
            )}
        </Stack>
    );
}
