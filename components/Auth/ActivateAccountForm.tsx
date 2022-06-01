import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "@mantine/form";
import { EnvelopeClosedIcon, LockClosedIcon } from "@modulz/radix-icons";
import {
    TextInput,
    PasswordInput,
    Group,
    Checkbox,
    Button,
    Paper,
    Text,
    LoadingOverlay,
    Anchor,
    Title,
    NumberInput,
    Stack,
    ThemeIcon
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { SimpleLink, TextLink } from "@cryptuoso/components/Link";
import { gqlPublicClient } from "@cryptuoso/libs/graphql";
import { gql } from "urql";
import { Confetti } from "tabler-icons-react";

export function ActivateAccountForm() {
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const decodedData = useMemo(
        () => JSON.parse(Buffer.from(router.query.encoded as string, "base64").toString("utf8")),
        [router.query.encoded]
    );

    const queryData = router.query.encoded
        ? decodedData
        : {
              email: null,
              secretCode: null
          };

    const form = useForm({
        initialValues: {
            email: queryData?.email || "",
            secret: queryData?.secretCode ? parseInt(queryData.secretCode) : ""
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            secret: (value) => (`${value}`.length === 6 && Number.isInteger(value) ? null : "Invalid secret")
        }
    });

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        const result = await gqlPublicClient
            .mutation<{ result: { accessToken: string } }, { email: string; secretCode: string }>(
                gql`
                    mutation authActivateAccount($email: String!, $secretCode: String!) {
                        result: authActivateAccount(email: $email, secretCode: $secretCode) {
                            accessToken
                        }
                    }
                `,
                {
                    email: form.values.email,
                    secretCode: `${form.values.secret}`
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
                    {confirmed ? "Your account is confirmed!" : "Please confirm your account"}
                </Title>

                {confirmed && <Text align="center">Redirecting to App...</Text>}
            </Stack>
            {!confirmed && (
                <Paper shadow="md" p={20} mt={20} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput
                            mt="md"
                            required
                            placeholder="Your email"
                            label="Email"
                            icon={<EnvelopeClosedIcon />}
                            {...form.getInputProps("email")}
                        />

                        <NumberInput
                            data-autofocus
                            required
                            hideControls
                            placeholder="Secret code we sended to your email"
                            label="Secret code"
                            {...form.getInputProps("secret")}
                        />

                        {error && (
                            <Text color="red" size="sm" mt="sm">
                                {error}
                            </Text>
                        )}

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
