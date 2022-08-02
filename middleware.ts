import { NextRequest, NextResponse } from "next/server";
import { UserAuthData } from "@cryptuoso/helpers";
import dayjs from "@cryptuoso/libs/dayjs";
import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req: NextRequest) {
        if (req.nextUrl.pathname.match(/requestProvider\.js\.map$/)?.length) {
            return NextResponse.rewrite(new URL("/404", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                // console.log("req", req);
                // console.log("token", token);
                if (req.nextUrl.pathname.startsWith("/app") || req.nextUrl.pathname.startsWith("/manage")) {
                    if (!token) {
                        console.error("No token found.");
                        return false;
                    }
                    if (!token.user) {
                        console.error("No user token found.");
                        return false;
                    }
                    const exp = token.exp as number;
                    const user = token.user as UserAuthData;
                    //    console.log(dayjs.utc(user.exp * 1000).toISOString());
                    //console.log(dayjs.utc(exp * 1000).toISOString());
                    if (user.exp * 1000 < dayjs.utc().valueOf() || exp * 1000 < dayjs.utc().valueOf()) {
                        console.error("Token expired.");
                        return false;
                    }
                    if (req.nextUrl.pathname.startsWith("/manage") && !user.allowedRoles.includes("manager")) {
                        console.error("User is not allowed to access this page.");
                        return false;
                    }
                }
                return true;
            }
        }
    }
);
