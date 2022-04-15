/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n: {
        locales: ["en"],
        defaultLocale: "en"
    },
    async redirects() {
        return [
            {
                source: "/docs",
                destination: "/docs/getting-started",
                permanent: true
            }
        ];
    }
};

module.exports = nextConfig;
