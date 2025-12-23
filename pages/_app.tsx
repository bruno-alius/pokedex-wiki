import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Handjet } from "next/font/google";

const handjet = Handjet({ variable: "--handjet", subsets: ["latin"]});

export const languages = ["es", "en"];

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <main className={`${handjet.variable} antialiased`}>
                <Component {...pageProps} />
            </main>
        </>
    );
}
