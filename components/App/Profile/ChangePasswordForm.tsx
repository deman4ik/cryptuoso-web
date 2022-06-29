import { Button, LoadingOverlay, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useState } from "react";
import { Lock } from "tabler-icons-react";
import { gql, useMutation } from "urql";

export function ChangePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            oldPassword: "",
            password: "",
            confirmPassword: ""
        },
        validate: {
            password: (value) =>
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
                    ? null
                    : "Password should contain 1 number, 1 letter and at least 6 characters",
            confirmPassword: (val, values) => (val === values?.password ? null : "Passwords don't match. Try again")
        }
    });

    const [, authChangePassword] = useMutation<
        { result: { result: string } },
        {
            password?: string;
            oldPassword?: string;
        }
    >(
        gql`
            mutation authChangePassword($password: String!, $oldPassword: String) {
                result: authChangePassword(password: $password, oldPassword: $oldPassword) {
                    result
                }
            }
        `
    );

    const handleSubmitEmail = async () => {
        setLoading(true);
        setError(null);

        const result = await authChangePassword({
            password: form.values.password,
            oldPassword: form.values.oldPassword
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

            <form onSubmit={form.onSubmit(handleSubmitEmail)}>
                <PasswordInput
                    placeholder="Your old password if you have one"
                    label="Old Password"
                    icon={<Lock size={20} />}
                    error={error}
                    {...form.getInputProps("oldPassword")}
                />

                <PasswordInput
                    mt="md"
                    required
                    placeholder="Your new password"
                    label="New Password"
                    icon={<Lock size={20} />}
                    {...form.getInputProps("password")}
                />

                <PasswordInput
                    mt="md"
                    required
                    placeholder="Confirm new password"
                    label="Confirm Password"
                    icon={<Lock size={20} />}
                    {...form.getInputProps("confirmPassword")}
                />

                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    mt="xl"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                >
                    Change Password
                </Button>
            </form>
        </div>
    );
}
