import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider, NormalizeCSS, GlobalStyles } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Provider as URQLProvider } from "urql";
import { client } from "../libs/graphql";
import { SessionProvider } from "next-auth/react";

export default function App(props: AppProps) {
    const { Component, pageProps } = props;

    return (
        <>
            <Head>
                <title>Cryptuoso</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.svg" />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
            </Head>
            <SessionProvider session={pageProps.session}>
                <URQLProvider value={client}>
                    <MantineProvider
                        theme={{
                            /** Put your mantine theme override here */
                            colorScheme: "dark",
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
                        <NormalizeCSS />
                        <GlobalStyles />
                        <NotificationsProvider>
                            <Component {...pageProps} />
                        </NotificationsProvider>
                    </MantineProvider>
                </URQLProvider>
            </SessionProvider>
        </>
    );
}
