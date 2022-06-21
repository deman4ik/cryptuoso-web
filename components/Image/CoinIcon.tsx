import Image, { ImageProps } from "next/image";

export function CoinIcon({
    src,
    alt,
    width,
    height,
    type = "color",
    ...others
}: ImageProps & { type?: "black" | "white" | "icon" | "color"; src: string }) {
    return (
        <Image
            {...others}
            src={`/coins/${type}/${src.toLowerCase()}.svg`}
            alt={alt || src.toUpperCase()}
            width={width || 32}
            height={height || 32}
        />
    );
}
//TODO: optimize types
//TODO: limit coins collection
//TODO: color props
