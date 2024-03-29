import { Layout } from "@cryptuoso/components/Landing/Layout";
import { ActivateAccountForm } from "@cryptuoso/components/Auth";
import Head from "next/head";

export default function ActivateAccount() {
    return (
        <Layout containerSize="sm">
            <Head>
                <title>Activate Account | CRYPTUOSO</title>
            </Head>
            <ActivateAccountForm />
        </Layout>
    );
}
