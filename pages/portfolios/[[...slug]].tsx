import { Layout } from "@cryptuoso/components/Landing/Layout";
import Head from "next/head";
import { ListPortfolios } from "@cryptuoso/components/App/Portfolio/ListPortfolios";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";
import { withUrqlClient } from "next-urql";

function PortfoliosPage() {
    return (
        <Layout containerSize="xl">
            <Head>
                <title>Portfolios | CRYPTUOSO</title>
            </Head>
            <ListPortfolios />
        </Layout>
    );
}

export default withUrqlClient((_ssrExchange, ctx) => ({
    url: `${process.env.NEXT_PUBLIC_HASURA_URL}`
}))(PortfoliosPage);
