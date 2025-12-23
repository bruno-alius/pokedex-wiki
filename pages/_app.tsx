import { NavBar } from "@/components/NavBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Rubik } from "next/font/google";

const rubik = Rubik({ variable: "--rubik", subsets: ["latin"] });

export const languages = ["es", "en"];

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <NavBar
                className={rubik.variable}
                {...pageProps.navbarProps}
            />
            <main className={`${rubik.variable} antialiased pt-nav-sm md:pt-nav-lg`}>
                <Component {...pageProps} />
            </main>
        </>
    );
}
