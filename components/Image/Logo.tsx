import Image from "next/image";

export function Logo({ width, height, ...other }: { width?: number; height?: number }) {
    return <Image src="/logo.svg" alt="Cryptuoso logo" width={width || 35} height={height || 35} {...other} />;
}
