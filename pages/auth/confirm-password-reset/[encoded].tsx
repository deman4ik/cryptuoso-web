import { Layout } from "@cryptuoso/components/Landing/Layout";
import { ConfirmPasswordResetForm } from "@cryptuoso/components/Auth";
import Head from "next/head";

export default function ConfirmPasswordReset() {
    return (
        <Layout containerSize="sm">
            <Head>
                <title>Confirm Password Reset | CRYPTUOSO</title>
            </Head>
            <ConfirmPasswordResetForm />
        </Layout>
    );
}
