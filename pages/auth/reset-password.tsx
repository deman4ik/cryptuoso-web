import { Layout } from "@cryptuoso/components/Landing/Layout";
import { ResetPasswordForm } from "@cryptuoso/components/Auth";
import Head from "next/head";

export default function ResetPassword() {
    return (
        <Layout containerSize="sm">
            <Head>
                <title>Reset Password | CRYPTUOSO</title>
            </Head>
            <ResetPasswordForm />
        </Layout>
    );
}
