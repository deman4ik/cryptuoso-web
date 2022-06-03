import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { Anchor, TextInput, Group, Button, Paper, Text, LoadingOverlay, Title, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import { gqlPublicClient } from "@cryptuoso/libs/graphql";
import { gql } from "urql";
import { Mail } from "tabler-icons-react";
import { SimpleLink } from "@cryptuoso/components/Link";

export function ResetPasswordForm() {
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const form = useForm({
        initialValues: {
            email: ""
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email")
        }
    });

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        const result = await gqlPublicClient
            .mutation<{ result: { result: string } }, { email: string }>(
                gql`
                    mutation authResetPassword($email: String!) {
                        result: authResetPassword(email: $email) {
                            result
                        }
                    }
                `,
                {
                    email: form.values.email
                }
            )
            .toPromise();
        console.log(result);
        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result.result === "OK") {
            router.replace(`/auth/confirm-password-reset/manual?email=${form.values.email}`);
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} />
            <Stack align="center">
                <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
                    Reseting your password
                </Title>
                <Text align="center">
                    {" "}
                    Enter the Email you have registered with. We will send you the instructions there.
                </Text>
            </Stack>

            <Paper shadow="md" p={20} mt={20} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        data-autofocus
                        required
                        placeholder="Your email"
                        label="Email"
                        icon={<Mail size={20} />}
                        {...form.getInputProps("email")}
                    />

                    {error && (
                        <Text color="red" size="sm" mt="sm">
                            {error}
                        </Text>
                    )}

                    <Group position="right" mt="md">
                        <Anchor component={SimpleLink} href="/auth/signin" size="sm">
                            Back to Sign In
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
                            Request password reset
                        </Button>
                    </Group>
                </form>
            </Paper>
        </div>
    );
}
