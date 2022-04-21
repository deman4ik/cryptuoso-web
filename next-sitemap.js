/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || "https://cryptuoso.com",
    generateRobotsTxt: true,
    exclude: ["/app/*", "/manage/*", "/auth/*"]
};
