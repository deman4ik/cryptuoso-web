import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import Head from "next/head";
import { Grid, Title, TypographyStylesProvider } from "@mantine/core";
import { Layout } from "@cryptuoso/components/Landing/Layout";
import { TableOfContents, TableOfContentsProps } from "@cryptuoso/components/Landing/TableOfContents";

export async function getStaticPaths() {
    const files = fs.readdirSync("docs");
    const paths = files.map((fileName) => {
        const readFile = fs.readFileSync(`docs/${fileName}`, "utf-8");
        const { data: frontmatter } = matter(readFile);
        return {
            params: {
                slug: frontmatter.slug
            }
        };
    });
    return {
        paths,
        fallback: false
    };
}

export async function getStaticProps({ params: { slug } }: { params: { slug: string } }) {
    const files = fs.readdirSync("docs");

    const docs = files.map((fileName) => {
        const readFile = fs.readFileSync(`docs/${fileName}`, "utf-8");
        const { data: frontmatter } = matter(readFile);
        return {
            fileName,
            slug: frontmatter.slug,
            frontmatter
        };
    });
    const links: TableOfContentsProps["links"] = docs
        .map(({ frontmatter: f }) => ({
            label: f.title,
            link: f.slug,
            order: f.order || 1,
            child: f.child || false
        }))
        .sort((a, b) => a.order - b.order);

    const fileName = docs.find((doc) => doc.slug === slug)?.fileName;
    const file = fs.readFileSync(`docs/${fileName}`, "utf-8");
    const { data: frontmatter, content } = matter(file);

    return {
        props: {
            slug,
            frontmatter,
            content,
            links
        }
    };
}

export default function DocsPage({
    frontmatter,
    content,
    links,
    slug
}: {
    frontmatter: matter.GrayMatterFile<string>["data"];
    content: string;
    links: TableOfContentsProps["links"];
    slug: string;
}) {
    return (
        <>
            <Head>
                {frontmatter.metaTitle && <title>{frontmatter.metaTitle}</title>}
                {frontmatter.metaDescription && <meta name="description" content={frontmatter.metaDescription} />}
            </Head>
            <Layout>
                <Grid grow>
                    <Grid.Col md={3}>
                        <TableOfContents links={links} active={slug} />
                    </Grid.Col>
                    <Grid.Col md={9}>
                        <Title>{frontmatter.title}</Title>
                        <TypographyStylesProvider>
                            <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
                        </TypographyStylesProvider>
                    </Grid.Col>
                </Grid>
            </Layout>
        </>
    );
}
