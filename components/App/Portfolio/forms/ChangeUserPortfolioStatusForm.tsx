import { Alert, Button, Group, LoadingOverlay, Text } from "@mantine/core";
import { useState } from "react";
import { AlertCircle } from "tabler-icons-react";
import { gql, useMutation } from "urql";

export function ChangeUserPortfolioStatusForm({
    onSuccess,
    onCancel,
    id,
    isStarted
}: {
    onSuccess: () => void;
    onCancel: () => void;
    id: string;
    isStarted: boolean;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [, userPortfolioStart] = useMutation<
        { result: { result: string } },
        {
            userPortfolioId: string;
        }
    >(
        gql`
            mutation userPortfolioStart($userPortfolioId: uuid!) {
                result: userPortfolioStart(id: $userPortfolioId) {
                    result
                }
            }
        `
    );

    const [, userPortfolioStop] = useMutation<
        { result: { result: string } },
        {
            userPortfolioId: string;
        }
    >(
        gql`
            mutation userPortfolioStop($userPortfolioId: uuid!) {
                result: userPortfolioStop(id: $userPortfolioId) {
                    result
                }
            }
        `
    );

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const result = isStarted
            ? await userPortfolioStop({ userPortfolioId: id })
            : await userPortfolioStart({ userPortfolioId: id });

        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result?.result) {
            if (onSuccess) {
                onSuccess();
            } else {
                setLoading(false);
            }
        }
    };
    return (
        <div style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} />
            <Text weight={500}>
                {isStarted
                    ? "Are you sure you want to stop trading now?"
                    : "Are you sure you want to start trading now?"}
            </Text>
            <Alert icon={<AlertCircle size={16} />} title="Attention!" color={isStarted ? "red" : "indigo"} mt="xs">
                {isStarted
                    ? "If there are any open positions they will be canceled (closed) with current market prices and potentially may cause profit losses!"
                    : "It is a realtime automated trading mode using your exchange account and you use it at your own risk!"}
            </Alert>
            {error && (
                <Text color="red" size="sm" mt="sm" weight={500}>
                    {error}
                </Text>
            )}
            <Group position="center" mt="xl" grow>
                <Button size="lg" fullWidth variant="subtle" color="gray" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    size="lg"
                    fullWidth
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                    onClick={handleSubmit}
                >
                    Confirm
                </Button>
            </Group>
        </div>
    );
}
