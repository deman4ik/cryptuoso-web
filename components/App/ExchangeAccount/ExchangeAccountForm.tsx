import { SimpleLink } from "@cryptuoso/components/Link";
import { Button, Group, LoadingOverlay, Paper, TextInput, Select, Text, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { Key, ShieldLock, Wallet } from "tabler-icons-react";
import { gql, useMutation, useQuery } from "urql";

const ExchangesQuery = gql`
    query Exchanges {
        exchanges {
            code
            name
        }
    }
`;

export function ExchangeAccountForm({
    exchange,
    id,
    onSuccess
}: {
    exchange?: string;
    id?: string;
    onSuccess?: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [result] = useQuery<
        {
            exchanges: {
                code: string;
                name: string;
            }[];
        },
        { userId: string }
    >({ query: ExchangesQuery, requestPolicy: "cache-first" });
    const { data, fetching, error: exchangesError } = result;
    const exchanges = data?.exchanges || [];

    if (exchangesError) console.error(exchangesError);

    const form = useForm({
        initialValues: {
            exchange: exchange || "binance_futures",
            key: "",
            secret: ""
        }

        /* validate: {
            exchange: (value) => !!value || "Invalid exchange",
            key: (value) => !!value || "Invalid key",
            secret: (value) => !!value || "Invalid secret"
        }*/
    });

    const [userExchangeAccUpsertResult, userExchangeAccUpsert] = useMutation<
        { result: string },
        {
            id?: string | null;
            exchange: string;
            keys: {
                key: string;
                secret: string;
                pass?: string | null;
            };
        }
    >(
        gql`
            mutation userExchangeAccUpsert($id: uuid, $exchange: String!, $keys: ExchangeKeys!) {
                result: userExchangeAccUpsert(id: $id, exchange: $exchange, keys: $keys) {
                    result
                }
            }
        `
    );

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        if (onSuccess) onSuccess();

        await userExchangeAccUpsert({
            id: id || null,
            exchange: form.values.exchange,
            keys: {
                key: form.values.key,
                secret: form.values.secret,
                pass: null
            }
        });

        const result = userExchangeAccUpsertResult;
        setLoading(false);
        if (result?.error) {
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result) {
            if (onSuccess) onSuccess();
        }
    };
    return (
        <div style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} />
            <Paper shadow="md" p={20} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        data={exchanges.map(({ code, name }) => ({ label: name, value: code }))}
                        disabled={!!id}
                        required
                        placeholder="Exchange"
                        label="Exchange"
                        icon={<Wallet size={20} />}
                        {...form.getInputProps("exchange")}
                    />

                    <TextInput
                        required
                        placeholder="Exchange Account API Key"
                        label="API Key"
                        mt="md"
                        icon={<Key size={20} />}
                        {...form.getInputProps("key")}
                    />

                    <TextInput
                        required
                        placeholder="Exchange Account API Secret"
                        label="API Secret"
                        mt="md"
                        icon={<ShieldLock size={20} />}
                        {...form.getInputProps("secret")}
                    />

                    {error && (
                        <Text color="red" size="sm" mt="sm">
                            {error}
                        </Text>
                    )}
                    <Group position="right" mt="md">
                        <Anchor component={SimpleLink} href="/docs/exchange-accounts" size="sm" target="_blank">
                            How to create API Keys?
                        </Anchor>
                    </Group>
                    <Group position="right" mt="md">
                        <Button
                            type="submit"
                            fullWidth
                            mt="sm"
                            variant="gradient"
                            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                        >
                            {!!id ? "Confirm" : "Create"}
                        </Button>
                    </Group>
                </form>
            </Paper>
        </div>
    );
}
