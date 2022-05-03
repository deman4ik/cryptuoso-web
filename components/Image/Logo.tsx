import { useMantineColorScheme } from "@mantine/core";
import Image from "next/image";

export function Logo({ width, height, ...other }: { width?: number; height?: number }) {
    const { colorScheme } = useMantineColorScheme();
    return (
        <Image
            src={`/logo-mini-${colorScheme}.svg`}
            alt="Cryptuoso logo"
            width={width || 35}
            height={height || 35}
            {...other}
        />
    );
}
