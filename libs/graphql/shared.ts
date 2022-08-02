import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function getServerSideProps(ctx: any) {
    return {
        props: {
            session: await unstable_getServerSession(ctx.req, ctx.res, authOptions)
        }
    };
}
