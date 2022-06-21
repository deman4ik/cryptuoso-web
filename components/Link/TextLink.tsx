import { Anchor, AnchorProps } from "@mantine/core";
import Link, { LinkProps } from "next/link";

export function TextLink({
    href,
    children,
    onClick,
    rel,
    align,
    ...others
}: AnchorProps<"a"> & { href?: LinkProps["href"]; children: React.ReactNode }) {
    if (href)
        return (
            <Link href={href} passHref>
                <Anchor align={align} {...others}>
                    {children}
                </Anchor>
            </Link>
        );
    else
        return (
            <Anchor href="#" {...others} onClick={onClick} align={align}>
                {children}
            </Anchor>
        );
}
