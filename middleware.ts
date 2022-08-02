import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.match(/requestProvider\.js\.map$/)?.length) {
        return NextResponse.rewrite(new URL("/404", req.url));
    }
}
