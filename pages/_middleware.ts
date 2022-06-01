import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    if (req.url.match(/requestProvider\.js\.map$/)?.length) {
        const url = new URL(req.url);
        url.pathname = "/404";
        return NextResponse.rewrite(url.toString());
    }
}
