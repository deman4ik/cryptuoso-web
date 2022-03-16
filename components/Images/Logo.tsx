import { Image } from "@mantine/core";

export function Logo({ width, height, ...other }: { width?: number; height?: number }) {
    return <Image src="/logo-accent.png" alt="Cryptuoso logo" width={width || 31} height={height || 30} {...other} />;
}
