import { Anchor, AnchorProps } from "@mantine/core";
import Link, { LinkProps } from "next/link";

export function TextLink({
    href,
    children,
    onClick,
    rel,
    ...others
}: AnchorProps<"a"> & { href?: LinkProps["href"]; children: React.ReactNode }) {
    if (href)
        return (
            <Link href={href} passHref>
                <Anchor {...others}>{children}</Anchor>
            </Link>
        );
    else
        return (
            <Anchor href="#" {...others} onClick={onClick}>
                {children}
            </Anchor>
        );
}
