import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider, NormalizeCSS, GlobalStyles, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Provider as URQLProvider } from "urql";
import { client } from "../libs/graphql";
import { SessionProvider } from "next-auth/react";
import { useHotkeys, useLocalStorageValue } from "@mantine/hooks";

export default function App(props: AppProps) {
    const { Component, pageProps } = props;

    const [colorScheme, setColorScheme] = useLocalStorageValue<ColorScheme>({
        key: "cryptuoso-color-scheme",
        defaultValue: "light"
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

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
                <URQLProvider value={client}>
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
                </URQLProvider>
            </SessionProvider>
        </>
    );
}
