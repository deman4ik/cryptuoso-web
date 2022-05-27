import { RefreshAction } from "@cryptuoso/components/App/Card";
import { Section } from "@cryptuoso/components/App/Dashboard";
import { StatsCard } from "@cryptuoso/components/App/Portfolio";
import { Group, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useContext } from "react";
import { UserPlus, Users } from "tabler-icons-react";
import { gql, useQuery } from "urql";
import { filterDatesToQuery, periodToDate } from "../Filters";
import { FiltersContext } from "../Layout";

const UsersQuery = gql`
    query usersCount($dateFrom: timestamp!, $dateTo: timestamp!) {
        usersTotal: users_aggregate(where: { status: { _eq: 1 } }) {
            aggregate {
                count
            }
        }
        usersWithPortfolios: user_portfolios_aggregate(where: { status: { _eq: "started" } }, distinct_on: [user_id]) {
            aggregate {
                count
            }
        }
        usersWithSubs: user_subs_aggregate(where: { status: { _eq: "active" } }, distinct_on: [user_id]) {
            aggregate {
                count
            }
        }
        usersTotalDate: users_aggregate(
            where: {
                status: { _eq: 1 }
                _and: [{ created_at: { _gte: $dateFrom } }, { created_at: { _lte: $dateTo } }]
            }
        ) {
            aggregate {
                count
            }
        }
        usersWithPortfoliosDate: user_portfolios_aggregate(
            where: {
                status: { _eq: "started" }
                _and: [{ created_at: { _gte: $dateFrom } }, { created_at: { _lte: $dateTo } }]
            }
            distinct_on: [user_id]
        ) {
            aggregate {
                count
            }
        }
        usersWithSubsDate: user_subs_aggregate(
            where: {
                status: { _eq: "active" }
                _and: [{ created_at: { _gte: $dateFrom } }, { created_at: { _lte: $dateTo } }]
            }
            distinct_on: [user_id]
        ) {
            aggregate {
                count
            }
        }
    }
`;

export function UsersSection() {
    const filters = useContext(FiltersContext);

    const [result, reexecuteQuery] = useQuery<
        {
            usersTotal: {
                aggregate: {
                    count: number;
                };
            };
            usersWithPortfolios: {
                aggregate: {
                    count: number;
                };
            };
            usersWithSubs: {
                aggregate: {
                    count: number;
                };
            };
            usersTotalDate: {
                aggregate: {
                    count: number;
                };
            };
            usersWithPortfoliosDate: {
                aggregate: {
                    count: number;
                };
            };
            usersWithSubsDate: {
                aggregate: {
                    count: number;
                };
            };
        },
        { dateFrom?: string | null; dateTo?: string | null }
    >({
        query: UsersQuery,
        variables: {
            dateFrom: filters.dates.dateFrom || dayjs.utc("2022-01-01").toISOString(),
            dateTo: filters.dates.dateTo || dayjs.utc("2030-01-01").toISOString()
        }
    });
    const { data, fetching, error } = result;
    const usersTotal = data?.usersTotal.aggregate.count;
    const usersWithPortfolios = data?.usersWithPortfolios.aggregate.count;
    const usersWithSubs = data?.usersWithSubs.aggregate.count;
    const usersTotalDate = data?.usersTotalDate.aggregate.count;
    const usersWithPortfoliosDate = data?.usersWithPortfoliosDate.aggregate.count;
    const usersWithSubsDate = data?.usersWithSubsDate.aggregate.count;

    if (error) console.error(error);
    return (
        <Section title="Users" left={<RefreshAction reexecuteQuery={reexecuteQuery} />}>
            <Group>
                <StatsCard
                    fetching={fetching}
                    Icon={Users}
                    title="All Users"
                    values={[
                        {
                            value: usersTotal,
                            desc: "Total"
                        },
                        {
                            value: usersWithPortfolios,
                            desc: "With Portfolios"
                        },
                        {
                            value: usersWithSubs,
                            desc: "With Subscriptions"
                        }
                    ]}
                />
                <StatsCard
                    fetching={fetching}
                    Icon={UserPlus}
                    title="New Users in period"
                    values={[
                        {
                            value: usersTotalDate,
                            desc: "Total"
                        },
                        {
                            value: usersWithPortfoliosDate,
                            desc: "With Portfolios"
                        },
                        {
                            value: usersWithSubsDate,
                            desc: "With Subscriptions"
                        }
                    ]}
                />
            </Group>
        </Section>
    );
}
