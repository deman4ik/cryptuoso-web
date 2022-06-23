import { Layout } from "@cryptuoso/components/Landing/Layout";
import Head from "next/head";
import { ListPortfolios } from "@cryptuoso/components/App/Portfolio/ListPortfolios";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

export default function PortfoliosPage() {
    return (
        <Layout containerSize="xl">
            <Head>
                <title>Portfolios | CRYPTUOSO</title>
            </Head>
            <ListPortfolios />
        </Layout>
    );
}
