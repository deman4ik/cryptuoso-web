import { Anchor, AnchorProps } from "@mantine/core";
import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";

export function TextLink({
    href,
    children,
    onClick,
    rel,
    align,
    target,
    ...others
}: AnchorProps & {
    href?: LinkProps["href"];
    children: React.ReactNode;
    onClick?: LinkProps["onClick"];
    rel?: AnchorHTMLAttributes<"a">["rel"];
    target?: AnchorHTMLAttributes<"a">["target"];
}) {
    if (href)
        return (
            <Link href={href} passHref>
                <Anchor component="a" align={align} target={target} rel={rel} {...others}>
                    {children}
                </Anchor>
            </Link>
        );
    else
        return (
            <Anchor component="a" href="#" {...others} onClick={onClick} align={align} rel={rel} target={target}>
                {children}
            </Anchor>
        );
}
