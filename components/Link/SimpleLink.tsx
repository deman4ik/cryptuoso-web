import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

export function SimpleLink({
    href,
    children,
    onClick,
    ...others
}: { href: LinkProps["href"] } & DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
    return (
        <Link href={href}>
            <a href={href} {...others}>
                {children}
            </a>
        </Link>
    );
}
