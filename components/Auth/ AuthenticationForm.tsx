import React, { useState } from "react";
import { useForm } from "@mantine/hooks";
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
    useMantineTheme
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export interface AuthenticationFormProps {
    style?: React.CSSProperties;
}

export function AuthenticationForm({ style }: AuthenticationFormProps) {
    const [formType, setFormType] = useState<"register" | "login">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useMantineTheme();
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

        validationRules: {
            name: (value) => formType === "login" || value.trim().length >= 2,
            email: (value) => /^\S+@\S+$/.test(value),
            password: (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value),
            confirmPassword: (val, values) => formType === "login" || val === values?.password
        }, //TODO: fastest-validator

        errorMessages: {
            email: "Invalid email",
            password: "Password should contain 1 number, 1 letter and at least 6 characters",
            confirmPassword: "Passwords don't match. Try again"
        }
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
                setError(result.error);
            } else if (result?.ok) {
                router.replace("/");
            }
        } else {
            setError("Not implemented"); //TODO
        }
    };

    return (
        <Paper
            padding="lg"
            shadow="sm"
            style={{
                position: "relative",
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
                ...style
            }}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <LoadingOverlay visible={loading} />
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
                        label="I agree to sell my soul and privacy to this corporation"
                        {...form.getInputProps("termsOfService", { type: "checkbox" })}
                    />
                )}

                {error && (
                    <Text color="red" size="sm" mt="sm">
                        {error}
                    </Text>
                )}

                <Group position="apart" mt="xl">
                    <Anchor component="button" type="button" color="gray" onClick={toggleFormType} size="sm">
                        {formType === "register" ? "Have an account? Login" : "Don't have an account? Register"}
                    </Anchor>

                    <Button color="blue" type="submit">
                        {formType === "register" ? "Register" : "Login"}
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}
