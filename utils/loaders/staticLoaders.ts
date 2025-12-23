import { NavBarProps } from "@/components/NavBar";
import { loadContentfulData } from "./contentfulDataLoader";
import { ContentfulData } from "@/types/ContentfulTypes";


//________________ INTERFACES ______________________

export interface StaticPathsResult {
    paths: StaticPathsParams[];
    fallback: boolean;
}

export interface StaticPathsParams {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any;
    locale?: string;
}

export interface StaticPropsResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: { data: any, navbarProps: NavBarProps, params?: any, locale: string | undefined }
}


//________________ FUNCTIONS ______________________

export async function getDefaultStaticProps({ params, locale }: StaticPathsParams, activeUrl?: string): Promise<StaticPropsResult> {
    const lang = locale || 'es';
    const data = await loadContentfulData(lang);
    const navbarProps = getNavbarProps(data, lang, activeUrl);

    if (params) {
        return {
            props: { data, navbarProps, params, locale: lang }
        };
    } else {
        return {
            props: { data, navbarProps, locale: lang }
        };
    }
}

export function getNavbarProps(data: ContentfulData, locale: string, activeUrl?: string): NavBarProps {
    return {
        options: [
            { name: data.generalContentEntries[0].section3NavbarTitle, href: '/about-me' }
        ],
        logo: data.generalContentEntries[0].navbarLogo!,
        lang: locale,
        activeUrl: activeUrl || null
    }
}