import React, { useMemo, useState } from "react";
import { useForm } from "@mantine/form";
import {
    TextInput,
    Group,
    Button,
    Paper,
    Text,
    LoadingOverlay,
    Title,
    NumberInput,
    Stack,
    ThemeIcon,
    PasswordInput,
    Anchor
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { SimpleLink, TextLink } from "@cryptuoso/components/Link";
import { gqlPublicClient } from "@cryptuoso/libs/graphql";
import { gql } from "urql";
import { Confetti, Mail, Lock, Key } from "tabler-icons-react";

export function ConfirmPasswordResetForm() {
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const decodedData = useMemo(
        () =>
            router.query.encoded !== "manual"
                ? JSON.parse(Buffer.from(router.query.encoded as string, "base64").toString("utf8"))
                : null,
        [router.query.encoded]
    );

    const queryData = decodedData
        ? decodedData
        : {
              email: router.query.email,
              secretCode: null
          };

    const form = useForm({
        initialValues: {
            email: queryData?.email || "",
            secret: queryData?.secretCode ? parseInt(queryData.secretCode) : "",
            password: "",
            confirmPassword: ""
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            secret: (value) => (`${value}`.length === 6 && Number.isInteger(value) ? null : "Invalid secret"),
            password: (value) =>
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
                    ? null
                    : "Password should contain 1 number, 1 letter and at least 6 characters",
            confirmPassword: (val, values) => (val === values?.password ? null : "Passwords don't match. Try again")
        }
    });

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        const result = await gqlPublicClient
            .mutation<{ result: { accessToken: string } }, { email: string; secretCode: string; password: string }>(
                gql`
                    mutation authConfirmPasswordReset($email: String!, $secretCode: String!, $password: String!) {
                        result: authConfirmPasswordReset(email: $email, secretCode: $secretCode, password: $password) {
                            accessToken
                        }
                    }
                `,
                {
                    email: form.values.email,
                    secretCode: `${form.values.secret}`,
                    password: form.values.password
                }
            )
            .toPromise();

        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result.accessToken) {
            const signInResult = await signIn<"credentials">("accessToken", {
                redirect: false,
                accessToken: result?.data?.result.accessToken
            });

            setLoading(false);

            if (signInResult?.error) {
                setError(signInResult.error.replace("[GraphQL] ", ""));
            } else if (signInResult?.ok) {
                setConfirmed(true);
                setTimeout(() => {
                    router.replace("/app");
                }, 1000);
            }
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} />
            <Stack align="center">
                {confirmed && (
                    <ThemeIcon size="xl" variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
                        <Confetti size={30} />
                    </ThemeIcon>
                )}
                <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
                    {confirmed ? "Your new password is set!" : "Please set your new password"}
                </Title>

                {confirmed && <Text align="center">Redirecting to App...</Text>}
            </Stack>
            {!confirmed && (
                <Paper shadow="md" p={20} mt={20} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput
                            required
                            placeholder="Your email"
                            label="Email"
                            icon={<Mail size={20} />}
                            {...form.getInputProps("email")}
                        />
                        <NumberInput
                            required
                            mt="md"
                            hideControls
                            placeholder="Secret code we sended to your email"
                            label="Secret code"
                            icon={<Key size={20} />}
                            {...form.getInputProps("secret")}
                        />
                        <PasswordInput
                            data-autofocus
                            mt="md"
                            required
                            placeholder="New password"
                            label="New password"
                            icon={<Lock size={20} />}
                            {...form.getInputProps("password")}
                        />

                        <PasswordInput
                            mt="md"
                            required
                            label="Confirm new password"
                            placeholder="Confirm new password"
                            icon={<Lock size={20} />}
                            {...form.getInputProps("confirmPassword")}
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
                                Confirm
                            </Button>
                        </Group>
                    </form>
                </Paper>
            )}
        </div>
    );
}
