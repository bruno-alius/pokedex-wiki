import ContentfulImage from "@/components/ContentfulImage";
import { Asset } from "contentful";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/router";

export interface NavBarProps {
  options: NavBarOption[];
  logo: Asset;
  className?: string;
  activeUrl: string | null;
  lang: string;
  expandType?: ExpandType;
}

export interface NavBarOption {
  name: string;
  href: string;
  children?: NavBarOption[];
}

export enum ExpandType {
  OnClick,
  OnHover,
}

const LINK_COMMON_CLASSES = `text-nav-default hover:text-nav-hover data-[active=true]:text-nav-active`;
const MENU_IMAGE_URL = "/icons/menu.svg";
const CLOSE_IMAGE_URL = "/icons/menu.svg";

export function NavBar({
  expandType = ExpandType.OnClick,
  ...props
}: NavBarProps) {
  const [url, setUrl] = useState("");
  const [isNavExpanded, setIsNavExpanded] = useState<boolean>(false);
  const [expandedElementIndex, setExpandedElementIndex] = useState<
    number | null
  >(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setUrl(props.activeUrl || router.asPath);
  }, [expandType, props, router.asPath]);

  return (
    <>
      {/* MÓVIL */}
      {isClient && isMobile && (
        <nav
          className={`flex flex-col transition-all select-none w-full z-10 fixed ${props.className}`}
        >
          <div className="z-50 flex p-4 bg-text-box">
            <Link className="flex-auto" href="/">
              <ContentfulImage
                asset={props.logo}
                className="mr-4 w-min h-[40px]"
                sizes="100px"
                priority={true}
              />
            </Link>
            <button
              className={`absolute right-2 p-0 w-[38px] transition-all h-[38px] ${
                isNavExpanded ? "opacity-0 pointer-events-none" : ""
              }`}
              onClick={() => setIsNavExpanded(true)}
            >
              <div
                className="bg-nav-default hover:bg-nav-hover w-full h-full transition-all"
                style={{
                  mask: `url(${MENU_IMAGE_URL}) no-repeat center`,
                  WebkitMask: `url(${MENU_IMAGE_URL}) no-repeat center`,
                }}
              />
            </button>
            <button
              className={`p-0 absolute right-2 w-[38px] transition-all h-[38px] ${
                isNavExpanded ? "" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setIsNavExpanded(false)}
            >
              <div
                className="bg-nav-default hover:bg-nav-hover w-full h-full transition-all"
                style={{
                  mask: `url(${CLOSE_IMAGE_URL}) no-repeat center`,
                  maskSize: "auto",
                  WebkitMask: `url(${CLOSE_IMAGE_URL}) no-repeat center`,
                }}
              />
            </button>
          </div>
          <div
            className="z-10 flex flex-col gap-4 data-[expanded=true]:opacity-0 data-[expanded=true]:p-0 py-4 data-[expanded=true]:h-0 bg-text-box transition-all data-[expanded=true]:translate-y-[-10%] data-[expanded=true]:pointer-events-none"
            data-expanded={isNavExpanded}
          >
            {props.options?.map((option, i) =>
              option.children ? (
                // DESPLEGABLE
                <div
                  className="relative flex flex-col items-center"
                  key={`nav-option-${i}`}
                  onMouseEnter={() => {
                    if (expandType == ExpandType.OnHover) {
                      setExpandedElementIndex(i);
                    }
                  }}
                  onMouseLeave={() => {
                    if (expandType == ExpandType.OnHover) {
                      setExpandedElementIndex(null);
                    }
                  }}
                >
                  {/* DESPLEGABLE - Padre */}
                  <button
                    className={`${LINK_COMMON_CLASSES} pl-5 w-full flex items-center transition-all  ${
                      expandType == ExpandType.OnHover ? "cursor-default" : ""
                    } ${expandedElementIndex == i ? "opacity-15" : ""}`}
                    data-active={option.children?.find((child) =>
                      url.includes(child.href)
                    )}
                    onClick={() => {
                      if (expandType == ExpandType.OnClick) {
                        if (expandedElementIndex === i) {
                          setExpandedElementIndex(null);
                        } else {
                          setExpandedElementIndex(i);
                        }
                      }
                    }}
                  >
                    {option.name}{" "}
                    <img
                      src={
                        option.children?.find((child) =>
                          url.includes(child.href)
                        )
                          ? "/icons/dropdown-icon-selected.png"
                          : "/icons/dropdown-icon.png"
                      }
                      alt="Dropdown icon"
                      className={`transition-all h-[1.25em] pr-3 pl-1`}
                    />
                  </button>
                  {/* DESPLEGABLE - Hijos */}
                  <div
                    className={`z-10 flex-col w-full gap-4 py-2 bg-text-box flex transition-all ${
                      expandedElementIndex == i
                        ? "h-auto"
                        : "h-0  translate-y-[-10%] opacity-0 pointer-events-none"
                    }`}
                  >
                    {option.children.map((child, i) => (
                      <Link
                        className={`${LINK_COMMON_CLASSES} w-full px-5 pb-3 first:pt-3 flex items-center transition-all`}
                        data-active={url.includes(option.href)}
                        key={`nav-option-${i}`}
                        href={child.href}
                        onClick={() => {
                          setExpandedElementIndex(null);
                          setIsNavExpanded(false);
                        }}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                // SIN DESPLEGABLE
                <Link
                  className={`${LINK_COMMON_CLASSES} px-5 flex items-center py-2 transition-all`}
                  key={`nav-option-${i}`}
                  data-active={url.includes(option.href)}
                  href={option.href}
                  onClick={() => {
                    setExpandedElementIndex(null);
                    setIsNavExpanded(false);
                  }}
                >
                  {option.name}
                </Link>
              )
            )}
            <div className="flex justify-center w-full">
              <LanguageSelector activeLanguage={props.lang} />
            </div>
          </div>
        </nav>
      )}
      {/* ESCRITORIO */}
      {isClient && !isMobile && (
        <nav
          className={`bg-text-box transition-all px-9 py-6 flex w-full fixed z-50 ${props.className}`}
        >
          <Link className="text-[1.25em]" href="/">
            <ContentfulImage
              asset={props.logo}
              className="mr-4 w-[100px]"
              sizes="100px"
              priority={true}
            />
          </Link>
          {props.options?.map((option, i) =>
            option.children ? (
              // DESPLEGABLE
              <div
                className="relative flex items-center"
                key={`nav-option-${i}`}
                onMouseEnter={() => {
                  if (expandType == ExpandType.OnHover) {
                    setExpandedElementIndex(i);
                  }
                }}
                onMouseLeave={() => {
                  if (expandType == ExpandType.OnHover) {
                    setExpandedElementIndex(null);
                  }
                }}
              >
                {/* DESPLEGABLE - Padre */}
                <button
                  className={`${LINK_COMMON_CLASSES} pl-5 flex items-center transition-all ${
                    expandType == ExpandType.OnHover ? "cursor-default" : ""
                  } ${expandedElementIndex == i ? "opacity-15" : ""}`}
                  data-active={option.children?.find((child) =>
                    url.includes(child.href)
                  )}
                  onClick={() => {
                    if (expandType == ExpandType.OnClick) {
                      if (expandedElementIndex === i) {
                        setExpandedElementIndex(null);
                      } else {
                        setExpandedElementIndex(i);
                      }
                    }
                  }}
                >
                  {option.name}{" "}
                  <img
                    src={
                      option.children?.find((child) => url.includes(child.href))
                        ? "/icons/dropdown-icon-selected.png"
                        : "/icons/dropdown-icon.png"
                    }
                    alt="Dropdown icon"
                    className={`transition-all h-[1.25em] pr-3 pl-1`}
                  />
                </button>
                {/* DESPLEGABLE - Hijos */}
                <div
                  className={`top-full left-0 z-10 absolute flex flex-col gap-4 py-2 bg-text-box transition-all ${
                    expandedElementIndex == i
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  {option.children.map((child, i) => (
                    <Link
                      className={`${LINK_COMMON_CLASSES} px-5 pb-3 first:pt-3 flex items-center transition-all`}
                      key={`nav-option-${i}`}
                      data-active={url.includes(option.href)}
                      href={child.href}
                      onClick={() => {
                        setExpandedElementIndex(null);
                        setIsNavExpanded(false);
                      }}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              // SIN DESPLEGABLE
              <Link
                className={`${LINK_COMMON_CLASSES} px-5 flex items-center transition-all`}
                key={`nav-option-${i}`}
                href={option.href}
                data-active={url.includes(option.href)}
                onClick={() => {
                  setExpandedElementIndex(null);
                  setIsNavExpanded(false);
                }}
              >
                {option.name}
              </Link>
            )
          )}
          <LanguageSelector
            activeLanguage={props.lang}
            className="flex-auto h-auto"
          />
        </nav>
      )}
    </>
  );
}

NavBar.defaultProps = { expandType: ExpandType.OnClick };
