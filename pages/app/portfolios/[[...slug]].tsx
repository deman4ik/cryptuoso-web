import { Text } from "@mantine/core";
import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";
import { CreateUserPortfolio } from "@cryptuoso/components/App/Portfolio";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

export default function PortfoliosPage() {
    return (
        <Layout>
            <Head>
                <title>Portfolios | CRYPTUOSO</title>
            </Head>
            <CreateUserPortfolio />
        </Layout>
    );
}
