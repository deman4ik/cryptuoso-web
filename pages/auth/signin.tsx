import { Layout } from "@cryptuoso/components/Landing/Layout";
import { AuthenticationForm } from "@cryptuoso/components/Auth";

export default function SignIn() {
    return (
        <Layout containerSize="sm">
            <AuthenticationForm />
        </Layout>
    );
}
