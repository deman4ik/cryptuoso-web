import { Button, ButtonProps } from "@mantine/core";
import Link, { LinkProps } from "next/link";

export function LinkButton({ href, children, ...others }: ButtonProps<"a"> & { href: LinkProps["href"] }) {
    return (
        <Link href={href}>
            <Button<"a"> component="a" {...others}>
                {children}
            </Button>
        </Link>
    );
}
