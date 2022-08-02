import dayjs from "@cryptuoso/libs/dayjs";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: any) {
    const session = await getSession(ctx);
    // console.log("getServerSideProps", ctx.req.url, session);
    if (
        (ctx.req.url.includes("/app") || ctx.req.url.includes("/manage")) &&
        (!session ||
            !session.user ||
            dayjs.utc(session.user.exp * 1000).isBefore(dayjs.utc()) ||
            dayjs.utc(session.expires).isBefore(dayjs.utc()))
    ) {
        return {
            redirect: {
                destination: "/auth/signin",
                permanent: false
            }
        };
    }
    if (ctx.req.url.includes("/manage") && session && !session.user.allowedRoles.includes("manager")) {
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        };
    }
    return {
        props: {
            session
        }
    };
}
