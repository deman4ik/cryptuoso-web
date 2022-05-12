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
    Container
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { SimpleLink } from "@cryptuoso/components/Link/SimpleLink";

export function AuthenticationForm() {
    const [formType, setFormType] = useState<"register" | "login">("login");
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
            name: (value) => (formType === "login" || value.trim().length >= 2 ? null : "Invalid name"),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            password: (value) =>
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
                    ? null
                    : "Password should contain 1 number, 1 letter and at least 6 characters",
            confirmPassword: (val, values) =>
                formType === "login" || val === values?.password ? null : "Passwords don't match. Try again"
        } //TODO: fastest-validator
    });

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        if (formType === "login") {
            const result = await signIn<"credentials">("credentials", {
                redirect: false,
                email: form.values.email,
                password: form.values.password
            });

            if (result?.error) {
                setLoading(false);
                setError(result.error.replace("[GraphQL] ", ""));
            } else if (result?.ok) {
                const url = router.query?.callbackUrl as string;
                router.replace(url || "/app");
            }
        } else {
            setError("Not implemented"); //TODO
        }
    };

    return (
        <Container size="sm" style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} />
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                {formType === "login" ? "Welcome back!" : "Welcome!"}
            </Title>

            {formType === "login" ? (
                <Text color="dimmed" size="sm" align="center" mt={5}>
                    Do not have an account yet?{" "}
                    <Anchor<"a"> href="#" size="sm" onClick={toggleFormType}>
                        Create account
                    </Anchor>
                </Text>
            ) : (
                <Text color="dimmed" size="sm" align="center" mt={5}>
                    Already have an account?{" "}
                    <Anchor<"a"> href="#" size="sm" onClick={toggleFormType}>
                        Sign in
                    </Anchor>
                </Text>
            )}
            <Paper shadow="md" p={20} mt={20} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    {formType === "register" && (
                        <TextInput
                            data-autofocus
                            required
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
                            label="I agree to the terms of conditions and the privacy policy"
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
                        {/** TODO: forgot password and link */}
                        <Button type="submit" fullWidth mt="sm">
                            {formType === "register" ? "Register" : "Login"}
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    );
}
