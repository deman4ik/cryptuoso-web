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
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.svg" />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
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
                                colors: {
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
