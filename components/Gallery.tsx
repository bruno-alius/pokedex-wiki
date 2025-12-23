import { useEffect, useState } from "react";
import { Work } from "@/types/ContentfulTypes";
import { AssetDetails } from "contentful";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import ContentfulImage from "@/components/ContentfulImage";

interface GalleryProps {
    seeMoreText: string;
    works?: Work[];
    rowCount?: {
        bigScreen: number;
        mediumScreen: number;
        smallScreen: number;
    };
    gap?: string;
}

const Gallery = (props: GalleryProps) => {
    //_________VARIABLES_________
    const works = props.works || [];
    const rowCountArray = props.rowCount || { bigScreen: 3, mediumScreen: 2, smallScreen: 1 };
    const [rowCount, setRowCount] = useState<number>(rowCountArray.bigScreen);
    const [galleryWorksRows, setgalleryWorksRows] = useState<Work[][]>([]);
    const mediumScreen = useMediaQuery("(min-width: 768px)");
    const bigScreen = useMediaQuery("(min-width: 1280px)");

    //____________FUNCTIONS__________

    function calculateRowCount(): number {
        if (mediumScreen) {
            if (bigScreen) {
                return rowCountArray.bigScreen;
            }
            return rowCountArray.mediumScreen;
        }
        return rowCountArray.smallScreen;
    }

    // Row height in column width units
    function getImageRowHeight(row: Work[]): number {
        let rowHeight = 0;

        row.forEach((work: Work) => {
            const img = (work.thumbnail.fields?.file?.details as AssetDetails)?.image;
            rowHeight += (img?.height || 1) / (img?.width || 1);
        });

        return rowHeight;
    }

    function getImageRowsFromImages(images: Work[], numberOfRows: number) {
        const imageRows: Work[][] = [];
        for (let index = 0; index < numberOfRows; index++) {
            imageRows.push([]);
        }

        images.forEach((work: Work) => {
            const indexArray = [...Array(numberOfRows).keys()];

            indexArray.sort(function (i1, i2) {
                const a = imageRows[i1];
                const b = imageRows[i2];
                if (getImageRowHeight(a) > getImageRowHeight(b)) {
                    return 1;
                }
                if (getImageRowHeight(a) < getImageRowHeight(b)) {
                    return -1;
                }
                return 1;
            });

            imageRows[indexArray[0]].push(work);
        });

        return imageRows;
    }

    //_________HOOKS_________
    useEffect(() => {
        setRowCount(calculateRowCount);
    }, [mediumScreen, bigScreen]);

    useEffect(() => {
        setgalleryWorksRows(getImageRowsFromImages(works, works.length < rowCount ? works.length : rowCount));
    }, [works, rowCount]);

    //_________COMPONENT_________
    return works.length > 0 ? (
        <div className="galllery">
            {galleryWorksRows && (
                <div className={`grid md:grid-cols-2 xl:grid-cols-3 gap-${props.gap || "0"}`}>
                    {galleryWorksRows &&
                        galleryWorksRows.map((imageRow: Work[], i: number) => (
                            <div
                                key={"row" + i}
                                className={`flex flex-col gap-${props.gap || "0"}`}>
                                {imageRow.map((work: Work, j: number) => (
                                    <Link
                                        href={`/work/${work.slug}`}
                                        key={`work-${j}`}
                                        className="relative">
                                        <ContentfulImage
                                            key={`img-${j}`}
                                            className="w-full"
                                            priority={j == 0}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            asset={work.thumbnail}
                                        />
                                        <div className="top-0 absolute flex flex-col justify-center items-center gap-8 opacity-0 hover:opacity-100 w-full h-full bg-text-1-transparent transition-all cursor-pointer">
                                            <h6 className="text-white">{work.title}</h6>
                                            <div className="flex justify-center items-center gap-1.5 p-2 rounded-[2]">
                                                <img
                                                    className="pb-[0.03em] h-[1.1em]"
                                                    src="/icons/eye.png"
                                                    alt="Eye icon"
                                                />
                                                <p className="text-white italic">{props.seeMoreText}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                </div>
            )}
        </div>
    ) : (
        <div className="white-bg | pad-xxl">No hay contenido que mostrar (por el momento).</div>
    );
};

export default Gallery;
