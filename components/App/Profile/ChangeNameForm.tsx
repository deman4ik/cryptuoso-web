import { Button, LoadingOverlay, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { User } from "tabler-icons-react";
import { gql, useMutation } from "urql";

export function ChangeNameForm({ name, onSuccess }: { name?: string; onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            name: name || ""
        },
        validate: {
            name: (value) =>
                value === "" || value === null || value === undefined || value.trim().length >= 2
                    ? null
                    : "Invalid name"
        }
    });

    const [, userChangeName] = useMutation<
        { result: { result: string } },
        {
            name?: string;
        }
    >(
        gql`
            mutation userChangeName($name: String!) {
                result: userChangeName(name: $name) {
                    result
                }
            }
        `
    );

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const result = await userChangeName({
            name: form.values.name
        });

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

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    required
                    placeholder="Your Name"
                    label="Name"
                    icon={<User size={20} />}
                    error={error}
                    {...form.getInputProps("name")}
                />

                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    mt="xl"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                >
                    Confirm
                </Button>
            </form>
        </div>
    );
}
