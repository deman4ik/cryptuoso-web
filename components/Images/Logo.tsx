import Link, { LinkProps } from "next/link";
import { Image } from "@mantine/core";

export function Logo({ width, height, ...other }: LinkProps & { width?: number; height?: number }) {
    return (
        <Link {...other} href="/">
            <a>
                <Image src="/logo-accent.png" alt="Cryptuoso logo" width={width || 30} height={height || 30} />
            </a>
        </Link>
    );
}
