import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import { UrlObject } from "url";

export function SimpleLink({
    href,
    children,
    onClick,
    ...others
}: { href: LinkProps["href"] | UrlObject } & DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
>) {
    return (
        <Link href={href} passHref>
            <a {...others}> {children}</a>
        </Link>
    );
}
