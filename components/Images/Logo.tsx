import Link, { LinkProps } from "next/link";
import { Image } from "@mantine/core";

export function Logo({ ...other }: LinkProps) {
    return (
        <Link {...other} href="/">
            <a>
                <Image src="/logo-accent.png" alt="Cryptuoso logo" width={45} height={44} />
            </a>
        </Link>
    );
}
