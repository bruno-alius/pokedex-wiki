import { Asset, AssetDetails } from "contentful";
import Image, { ImageLoaderProps } from "next/image";

interface ContentfulImageProps {
    asset: Asset;
    fillAspectRatio?: number;
    className?: string;
    quality?: number;
    sizes?: string;
    // eslint-disable-next-line
    [key: string]: any; // F
}

export default function ContentfulImage(props: ContentfulImageProps) {
    const imageSize = (props.asset?.fields?.file?.details as AssetDetails)?.image;
    const { asset, className, fillAspectRatio, quality, sizes, ...imageProps } = props;

    const contentfulLoader = ({ src, width, quality }: ImageLoaderProps) => {
        return `${src}?fit=fill&w=${width}` + (fillAspectRatio ? `&h=${width / fillAspectRatio}` : ``) + (quality ? `&q=${quality}` : ``) + (src.split(".").pop() == "svg" ? "" : "&fm=webp");
    };

    return (
        <Image
            src={asset?.fields?.file?.url?.toString() || ""}
            alt={asset?.fields?.description?.toString() || ""}
            loader={contentfulLoader}
            width={imageSize?.width}
            height={imageSize?.height}
            className={className}
            quality={quality || 99}
            sizes={sizes || "100vw"}
            {...imageProps}
        />
    );
}
