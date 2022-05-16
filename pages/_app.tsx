import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { getCookie, setCookies } from "cookies-next";
import { getSession, SessionProvider } from "next-auth/react";
import { useHotkeys } from "@mantine/hooks";
import GraphqlProvider from "@cryptuoso/libs/graphql/provider";
import { useState } from "react";
import { Session } from "next-auth";
import { Provider as URQLProvider } from "urql";
import { publicClient } from "@cryptuoso/libs/graphql/client";

export default function MyApp(props: AppProps & { colorScheme: ColorScheme }) {
    const { Component, pageProps } = props;

    const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme = value || (colorScheme === "dark" ? "light" : "dark");
        setColorScheme(nextColorScheme);
        // when color scheme is updated save it to cookie
        setCookies("mantine-color-scheme", nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
    };

    useHotkeys([["mod+J", () => toggleColorScheme()]]);

    return (
        <>
            <Head>
                <title>CRYPTUOSO</title>
                <meta name="viewport" content="maximum-scale=1, minimum-scale=1, initial-scale=1, width=device-width" />
                <meta name="description" content="Cryptuoso Cryptocurrency Trading Bot" />
                <meta
                    name="keywords"
                    content="cryptocurrency, bitcoin, trading, signals, robots, btc, crypto, mining, binance, nft, eth, bnb"
                />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.svg" />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
                {process.env.NEXT_DISABLE_ANALYTICS ? null : (
                    <>
                        <script
                            type="text/javascript"
                            dangerouslySetInnerHTML={{
                                __html: `
                                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                                m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                             
                                ym(69520861, "init", {
                                     clickmap:true,
                                     trackLinks:true,
                                     accurateTrackBounce:true,
                                     webvisor:true
                                });
                          `
                            }}
                        />
                        <noscript
                            dangerouslySetInnerHTML={{
                                __html: `<noscript><div><img src="https://mc.yandex.ru/watch/69520861" style="position:absolute; left:-9999px;" alt="" /></div></noscript>`
                            }}
                        />
                    </>
                )}
            </Head>
            <SessionProvider session={pageProps.session}>
                <GraphqlProvider>
                    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                        <MantineProvider
                            withGlobalStyles
                            withNormalizeCSS
                            theme={{
                                /** Put your mantine theme override here */
                                colorScheme,
                                primaryColor: "indigo",
                                primaryShade: 9,
                                colors: {
                                    dark: [
                                        "#C1C2C5",
                                        "#A6A7AB",
                                        "#909296",
                                        "#5C5F66",
                                        "#313643",
                                        "#2A2D3A",
                                        "#252834",
                                        "#1D202B",
                                        "#191C26",
                                        "#161924"
                                    ],
                                    coolGray: [
                                        "#f9fafb",
                                        "#f3f4f6",
                                        "#e5e7eb",
                                        "#d1d5db",
                                        "#9ca3af",
                                        "#6b7280",
                                        "#4b5563",
                                        "#374151",
                                        "#1f2937",
                                        "#111827"
                                    ],
                                    blueGray: [
                                        "#f8fafc",
                                        "#f1f5f9",
                                        "#e2e8f0",
                                        "#cbd5e1",
                                        "#94a3b8",
                                        "#64748b",
                                        "#475569",
                                        "#334155",
                                        "#1e293b",
                                        "#0f172a"
                                    ]
                                }
                            }}
                        >
                            <NotificationsProvider>
                                <Component {...pageProps} />
                            </NotificationsProvider>
                        </MantineProvider>
                    </ColorSchemeProvider>
                </GraphqlProvider>
            </SessionProvider>
        </>
    );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
    let session: Session | null | undefined = undefined;
    // getSession works both server-side and client-side but we want to avoid any calls to /api/auth/session
    // on page load, so we only call it server-side.
    if (typeof window === "undefined") session = await getSession(appContext.ctx);
    const appProps = await App.getInitialProps(appContext);
    return {
        ...appProps,
        ...(session !== undefined ? { session } : {}),
        colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "dark"
    };
};
// get color scheme from cookie
