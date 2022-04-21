import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => (token?.roles as string[]).includes("manager")
    }
});