import { Asset } from "contentful";
import ContentfulImage from "./ContentfulImage";
import { useEffect, useState } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { useWindowSize } from "usehooks-ts";

export interface CarouselProps {
    images: Asset[];
    cyclic?: boolean;
    autoPlay?: boolean;
    imagesPerSlide?: number;
    className?: string;
    imageSizes?: string;
}

const WorkCarousel = (props: CarouselProps) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const slideLength = Math.ceil(props.images.length / (props.imagesPerSlide || 1));
    const windowSize = useWindowSize();

    function getArrowOpacity(disabled: boolean, mobile: boolean) {
        if (mobile) {
            if (disabled) {
                return 0.1;
            } else {
                return 0.66;
            }
        } else {
            if (disabled) {
                return 0.2;
            } else {
                return 1;
            }
        }
    }

    useEffect(() => {
        if (props.autoPlay) {
            const interval = setInterval(() => {
                setSlideIndex(slideIndex + 1 >= slideLength ? 0 : slideIndex + 1);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [props.autoPlay, slideLength, slideIndex]);

    return (
        <div className={`flex relative items-center select-none ${props.className || ''}`}>
            <FaChevronCircleLeft
                className="left-[5vw] md:left-auto absolute md:relative w-12 h-12 text-white md:text-text-1 transition-all hover:text-accent-2 cursor-pointer"
                style={!props.cyclic && slideIndex == 0 ? { opacity: getArrowOpacity(true, windowSize.width < 768), pointerEvents: "none" } : { opacity: getArrowOpacity(false, windowSize.width < 768) }}
                onClick={() => setSlideIndex(slideIndex - 1 < 0 ? slideLength - 1 : slideIndex - 1)}
            />
            <div className="w-full overflow-hidden">
                <div
                    className="flex transition-all duration-1000"
                    style={{ width: `${slideLength * 100}%`, marginLeft: `-${slideIndex * 100}%` }}>
                    {props.images.map((image, index) => (
                        <div
                            className="flex justify-center items-center p-2 last:pr-4 first:pl-4"
                            key={`carousel-img-${index}`}
                            style={{ width: `${100 / (slideLength * (props.imagesPerSlide || 1))}%` }}>
                            <ContentfulImage
                                className="w-full max-h-[550px] object-contain"
                                sizes={props.imageSizes}
                                asset={image}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <FaChevronCircleRight
                className="right-[5vw] md:right-auto absolute md:relative drop-shadow-lg rounded w-12 h-12 md:h-12 text-white md:text-text-1 transition-all hover:text-accent-2 cursor-pointer"
                style={!props.cyclic && slideIndex >= slideLength - 1 ? { opacity: getArrowOpacity(true, windowSize.width < 768), pointerEvents: "none" } : { opacity: getArrowOpacity(false, windowSize.width < 768) }}
                onClick={() => setSlideIndex(slideIndex + 1 >= slideLength ? 0 : slideIndex + 1)}
            />
        </div>
    );
};

export default WorkCarousel;
