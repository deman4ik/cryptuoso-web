import { Button, LoadingOverlay, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Key, Mail, User } from "tabler-icons-react";
import { gql, useMutation } from "urql";

export function ChangeEmailForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<"email" | "confirm">("email");

    const emailForm = useForm({
        initialValues: {
            email: ""
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email")
        }
    });

    const confirmForm = useForm({
        initialValues: {
            secretCode: ""
        },
        validate: {
            secretCode: (value) => (`${value}`.length === 6 && Number.isInteger(value) ? null : "Invalid secret")
        }
    });

    const [, authChangeEmail] = useMutation<
        { result: { result: string } },
        {
            email?: string;
        }
    >(
        gql`
            mutation authChangeEmail($email: String!) {
                result: authChangeEmail(email: $email) {
                    result
                }
            }
        `
    );

    const [, authConfirmEmailChange] = useMutation<
        { result: { accessToken: string } },
        {
            secretCode?: string;
        }
    >(
        gql`
            mutation authConfirmEmailChange($secretCode: String!) {
                result: authConfirmEmailChange(secretCode: $secretCode) {
                    accessToken
                }
            }
        `
    );
    const handleSubmitEmail = async () => {
        setLoading(true);
        setError(null);

        const result = await authChangeEmail({
            email: emailForm.values.email
        });

        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result?.result) {
            setLoading(false);
            setStep("confirm");
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);

        const result = await authConfirmEmailChange({
            secretCode: `${confirmForm.values.secretCode}`
        });

        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result?.accessToken) {
            const signInResult = await signIn<"credentials">("accessToken", {
                redirect: false,
                accessToken: result?.data?.result.accessToken
            });
            setLoading(false);

            if (signInResult?.error) {
                setError(signInResult.error.replace("[GraphQL] ", ""));
            } else if (signInResult?.ok) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        }
    };
    return (
        <div style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} />

            {step === "email" ? (
                <form onSubmit={emailForm.onSubmit(handleSubmitEmail)}>
                    <TextInput
                        required
                        placeholder="Your New Email"
                        label="New Email"
                        icon={<Mail size={20} />}
                        error={error}
                        {...emailForm.getInputProps("email")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        mt="xl"
                        variant="gradient"
                        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                    >
                        Change Email
                    </Button>
                </form>
            ) : (
                <form onSubmit={confirmForm.onSubmit(handleConfirm)}>
                    <NumberInput
                        required
                        hideControls
                        placeholder="Secret code we sended to your email"
                        label="Secret code"
                        icon={<Key size={20} />}
                        error={error}
                        {...confirmForm.getInputProps("secretCode")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        mt="xl"
                        variant="gradient"
                        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                    >
                        Confirm New Email
                    </Button>
                </form>
            )}
        </div>
    );
}
