import { Text, TextProps } from "@mantine/core";
import Link, { LinkProps } from "next/link";

export function TextLink({ href, children, onClick, ...others }: TextProps<"a"> & { href?: LinkProps["href"] }) {
    if (href)
        return (
            <Link href={href} passHref>
                <Text<"a"> component="a" {...others}>
                    {children}
                </Text>
            </Link>
        );
    else
        return (
            <Text<"a"> component="a" {...others} onClick={onClick}>
                {children}
            </Text>
        );
}
