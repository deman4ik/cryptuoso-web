import { Avatar } from "@mantine/core";
import Image, { ImageProps } from "next/image";

function fallback(name: string) {
    if (name === "CELR") return true;
    if (name === "KAVA") return true;
    return false;
}

export function CoinIcon({
    src,
    alt,
    width,
    height,
    type = "color",
    ...others
}: ImageProps & { type?: "black" | "white" | "icon" | "color"; src: string }) {
    return fallback(src) ? (
        <Avatar radius="xl">{src}</Avatar>
    ) : (
        <Image
            {...others}
            src={`/coins/${type}/${src.toLowerCase()}.svg`}
            alt={alt || src.toUpperCase()}
            width={width || 38}
            height={height || 38}
        />
    );
}
//TODO: optimize types
//TODO: limit coins collection
//TODO: color props
