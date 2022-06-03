import { Layout } from "@cryptuoso/components/Landing/Layout";
import { AuthenticationForm } from "@cryptuoso/components/Auth";
import Head from "next/head";

export default function SignIn() {
    return (
        <Layout containerSize="sm">
            <Head>
                <title>Sign In | CRYPTUOSO</title>
            </Head>
            <AuthenticationForm />
        </Layout>
    );
}
