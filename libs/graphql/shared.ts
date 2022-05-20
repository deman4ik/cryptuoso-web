import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: any) {
    return {
        props: {
            session: await getSession(ctx)
        }
    };
}
