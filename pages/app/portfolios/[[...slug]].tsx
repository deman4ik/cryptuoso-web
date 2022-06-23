import { Layout } from "@cryptuoso/components/App/Layout/Layout";
import Head from "next/head";
import { ListPortfolios } from "@cryptuoso/components/App/Portfolio/ListPortfolios";
import { useSession } from "next-auth/react";
import { useQuery } from "urql";
import { UserExAcc, UserPortfolio } from "@cryptuoso/types";
import { UserExAccAndPortfolioQuery } from "@cryptuoso/queries";
export { getServerSideProps } from "@cryptuoso/libs/graphql/shared";

export default function PortfoliosPage() {
    const { data: session } = useSession<true>({ required: true });
    const [userResult] = useQuery<
        {
            userExAcc: UserExAcc[];
            userPortfolio: UserPortfolio[];
        },
        { userId: string }
    >({ query: UserExAccAndPortfolioQuery, variables: { userId: session?.user?.userId || "" } });

    const { data: userData, fetching: userFetching, error: userError } = userResult;
    const userExAcc = userData?.userExAcc[0];
    const userPortfolio = userData?.userPortfolio[0];
    return (
        <Layout>
            <Head>
                <title>Portfolios | CRYPTUOSO</title>
            </Head>
            <ListPortfolios userExAcc={userExAcc} userPortfolio={userPortfolio} fetching={userFetching} />
        </Layout>
    );
}
