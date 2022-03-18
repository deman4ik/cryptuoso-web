import Image, { ImageProps } from "next/image";

export function CoinIcon({
    src,
    alt,
    width,
    height,
    type,
    ...others
}: ImageProps & { type?: "black" | "white" | "icon" | "color"; src: string }) {
    return (
        <Image
            {...others}
            src={`/coins/${type || "icon"}/${src.toLowerCase()}.svg`}
            alt={alt || src.toUpperCase()}
            width={width || 32}
            height={height || 32}
        />
    );
}
//TODO: optimize types
//TODO: limit coins collection
//TODO: color props
