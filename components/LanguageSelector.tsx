import { languages } from "@/pages/_app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type LanguageSelectorProps = {
  activeLanguage: string;
  className?: string;
};

export const LanguageSelector = (props: LanguageSelectorProps) => {
  const [expanded, setExpanded] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(props.activeLanguage);

  const router = useRouter();
  const currentPath = router.asPath;

  useEffect(() => {
    setActiveLanguage(props.activeLanguage);
  }, [props.activeLanguage]);

  return (
    <div className={`${props.className} flex items-center justify-end`}>
      <div
        data-expanded={expanded}
        className="group flex flex-row justify-end items-center gap-1.5 data-[expanded=true]:gap-3 pt-2 md:pt-0 text-nav-default *:leading-[100%] transition-all *:transition-all cursor-pointer"
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <div
          className="bg-nav-default group-hover:data-[active=false]:bg-nav-hover w-[1em] h-[1em]"
          data-active={expanded}
          style={{
            mask: "url(/icons/globe.svg) no-repeat center",
            WebkitMask: "url(/icons/globe.svg) no-repeat center",
          }}
        ></div>
        {languages
          .filter((language) => language == activeLanguage)
          .map((language) => (
            <span
              data-active={expanded}
              key={language}
              className="mt-[-0.1em] font-bold text-nav-default group-hover:data-[active=false]:text-nav-hover"
            >
              {language.toUpperCase()}{" "}
            </span>
          ))}
        {expanded &&
          languages
            .filter((language) => language != activeLanguage)
            .map((language) => (
              <Link
                href={currentPath}
                locale={language}
                key={language}
                className="mt-[-0.1em] font-normal hover:text-nav-hover"
                onClick={() => {
                  setActiveLanguage(language);
                }}
              >
                {language.toUpperCase()}{" "}
              </Link>
            ))}
      </div>
    </div>
  );
};
