import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import { Layout } from "@cryptuoso/components/Landing/Layout/Layout";
import { TypographyStylesProvider } from "@mantine/core";
import Head from "next/head";

export async function getStaticPaths() {
    const files = fs.readdirSync("info");
    const paths = files.map((fileName) => ({
        params: {
            slug: fileName.replace(".md", "")
        }
    }));
    return {
        paths,
        fallback: false
    };
}

export async function getStaticProps({ params: { slug } }: { params: { slug: string } }) {
    const fileName = fs.readFileSync(`info/${slug}.md`, "utf-8");
    const { data: frontmatter, content } = matter(fileName);
    return {
        props: {
            frontmatter,
            content
        }
    };
}

export default function InfoPage({
    frontmatter,
    content
}: {
    frontmatter: matter.GrayMatterFile<string>["data"];
    content: string;
}) {
    return (
        <>
            <Head>
                {frontmatter.metaTitle && <title>{frontmatter.metaTitle}</title>}
                {frontmatter.metaDescription && <meta name="description" content={frontmatter.metaDescription} />}
            </Head>
            <Layout>
                <h1>{frontmatter.title}</h1>
                <TypographyStylesProvider>
                    <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
                </TypographyStylesProvider>
            </Layout>
        </>
    );
}
