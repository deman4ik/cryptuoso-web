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
                if (req.nextUrl.pathname.startsWith("/app") || req.nextUrl.pathname.startsWith("/manage")) {
                    if (!token) return false;
                    if (!token.user) return false;
                    const exp = token.exp as number;
                    const user = token.user as UserAuthData;
                    if (user.exp * 1000 < dayjs.utc().valueOf() || exp * 1000 < dayjs.utc().valueOf()) return false;
                    if (req.nextUrl.pathname.startsWith("/manage") && !user.allowedRoles.includes("manager"))
                        return false;
                }
                return true;
            }
        }
    }
);
