import React, { useState } from "react";
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
    Stack,
    Divider,
    SimpleGrid,
    Center
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { SimpleLink, TextLink } from "@cryptuoso/components/Link";
import { gqlPublicClient } from "@cryptuoso/libs/graphql";
import { gql } from "urql";
import { TelegramLoginWidget } from "./TelegramLoginWidget";

export function AuthenticationForm() {
    const [formType, setFormType] = useState<"register" | "login" | "success">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const toggleFormType = () => {
        setFormType((current) => (current === "register" ? "login" : "register"));
        setError(null);
    };

    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            termsOfService: true
        },

        validate: {
            name: (value) =>
                formType === "login" ||
                value === "" ||
                value === null ||
                value === undefined ||
                value.trim().length >= 2
                    ? null
                    : "Invalid name",
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            password: (value) =>
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
                    ? null
                    : "Password should contain 1 number, 1 letter and at least 6 characters",
            confirmPassword: (val, values) =>
                formType === "login" || val === values?.password ? null : "Passwords don't match. Try again"
        } //TODO: fastest-validator
    });

    const handleSubmit = async (data?: any) => {
        setLoading(true);
        setError(null);
        if (formType === "login") {
            let result;
            if (data) {
                result = await signIn<"credentials">("telegram", {
                    redirect: false,
                    data: JSON.stringify(data)
                });
            } else {
                result = await signIn<"credentials">("email", {
                    redirect: false,
                    email: form.values.email,
                    password: form.values.password
                });
            }

            if (result?.error) {
                setLoading(false);
                setError(result.error.replace("[GraphQL] ", ""));
            } else if (result?.ok) {
                let url;
                console.log("callbackUrl", router.query?.callbackUrl);
                if (router.query?.callbackUrl) {
                    if (Array.isArray(router.query?.callbackUrl) && router.query?.callbackUrl.length > 0) {
                        url = router.query?.callbackUrl[router.query?.callbackUrl.length - 1];
                    } else url = router.query?.callbackUrl as string;
                }
                router.replace(url || "/app");
            }
        } else {
            const result = await gqlPublicClient
                .mutation<{ result: { userId: string } }, { email: string; password: string; name?: string }>(
                    gql`
                        mutation authRegister($email: String!, $password: String!, $name: String) {
                            result: authRegister(email: $email, password: $password, name: $name) {
                                userId
                            }
                        }
                    `,
                    {
                        email: form.values.email,
                        password: form.values.password,
                        name: form.values.name === "" ? undefined : form.values.name
                    }
                )
                .toPromise();

            setLoading(false);
            if (result?.error) {
                setError(result.error.message.replace("[GraphQL] ", ""));
            } else if (result?.data?.result.userId) {
                setFormType("success");
            }
        }
    };

    let title;
    let subtitle;
    switch (formType) {
        case "login":
            title = (
                <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
                    Welcome Back!
                </Title>
            );
            subtitle = (
                <Text color="dimmed" size="sm" align="center" mt={5}>
                    Do not have an account yet?{" "}
                    <Anchor<"a"> href="#" size="sm" onClick={toggleFormType}>
                        Create account
                    </Anchor>
                </Text>
            );
            break;
        case "register":
            title = (
                <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
                    Welcome!
                </Title>
            );
            subtitle = (
                <Text color="dimmed" size="sm" align="center" mt={5}>
                    Already have an account?{" "}
                    <Anchor<"a"> href="#" size="sm" onClick={toggleFormType}>
                        Sign in
                    </Anchor>
                </Text>
            );
            break;
        case "success":
            title = (
                <Stack>
                    <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
                        Success!
                    </Title>
                    <Text>Please check email to activate your account.</Text>
                </Stack>
            );
            subtitle = (
                <Text color="dimmed" size="sm" align="center" mt={5}>
                    Already activated your account?{" "}
                    <Anchor<"a"> href="#" size="sm" onClick={toggleFormType}>
                        Sign in
                    </Anchor>
                </Text>
            );
            break;
    }
    return (
        <div style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} />
            <Stack align="center">
                {title}
                {subtitle}
            </Stack>
            {formType !== "success" && (
                <Paper shadow="md" p={20} mt={20} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        {formType === "register" && (
                            <TextInput
                                data-autofocus
                                placeholder="Your  name"
                                label="Name"
                                {...form.getInputProps("name")}
                            />
                        )}

                        <TextInput
                            mt="md"
                            required
                            placeholder="Your email"
                            label="Email"
                            icon={<EnvelopeClosedIcon />}
                            {...form.getInputProps("email")}
                        />

                        <PasswordInput
                            mt="md"
                            required
                            placeholder="Password"
                            label="Password"
                            icon={<LockClosedIcon />}
                            {...form.getInputProps("password")}
                        />

                        {formType === "register" && (
                            <PasswordInput
                                mt="md"
                                required
                                label="Confirm Password"
                                placeholder="Confirm password"
                                icon={<LockClosedIcon />}
                                {...form.getInputProps("confirmPassword")}
                            />
                        )}

                        {formType === "register" && (
                            <Checkbox
                                mt="xl"
                                label={
                                    <Text size="sm">
                                        I agree to the{" "}
                                        <TextLink href="/info/terms" size="sm" target="_blank">
                                            terms of conditions
                                        </TextLink>{" "}
                                        and the{" "}
                                        <TextLink href="/info/privacy" size="sm" target="_blank">
                                            privacy policy
                                        </TextLink>
                                    </Text>
                                }
                                {...form.getInputProps("termsOfService", { type: "checkbox" })}
                            />
                        )}

                        {error && (
                            <Text color="red" size="sm" mt="sm">
                                {error}
                            </Text>
                        )}

                        <Group position="right" mt="md">
                            {formType === "login" && (
                                <Anchor component={SimpleLink} href="/auth/forgotpassword" size="sm">
                                    Forgot password?
                                </Anchor>
                            )}{" "}
                        </Group>
                        {/** TODO: forgot password and link */}
                        <Stack>
                            <Button
                                type="submit"
                                fullWidth
                                mt="sm"
                                variant="gradient"
                                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                            >
                                {formType === "register" ? "Register" : "Login"}
                            </Button>
                            <Divider label="OR" labelPosition="center" />

                            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 576, cols: 1 }]}>
                                <Center>
                                    <Text color="dimmed" size="sm" align="center">
                                        If you have a Telegram account and want to use{" "}
                                        <Anchor<"a">
                                            href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}`}
                                            size="sm"
                                            target="_blank"
                                        >
                                            Cryptuoso Trading Telegram bot
                                        </Anchor>{" "}
                                        just log in using Telegram
                                    </Text>
                                </Center>
                                <Center>
                                    <TelegramLoginWidget onAuth={handleSubmit} />
                                </Center>
                            </SimpleGrid>
                        </Stack>
                    </form>
                </Paper>
            )}
        </div>
    );
}
