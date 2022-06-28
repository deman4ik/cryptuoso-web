import { ResponsiveTable } from "@cryptuoso/components/App/Table";
import { CoinIcon } from "@cryptuoso/components/Image";
import { plusNum } from "@cryptuoso/helpers";
import dayjs from "@cryptuoso/libs/dayjs";
import { BasePosition, PositionStatus } from "@cryptuoso/types";
import { Badge, Group, Text, Stack, ThemeIcon, useMantineTheme } from "@mantine/core";
import { ArrowDown, ArrowUp } from "tabler-icons-react";
import { PositionDirectionLabel } from "./controls/PositionDirectionLabel";

const getPositionStatusColor = (status?: PositionStatus) => {
    if (status === "open") return "blue";
    else if (status === "closedAuto") return "yellow";
    else return "green";
};

const getPositionStatusText = (status?: PositionStatus) => {
    if (status === "closedAuto") return "closed auto";
    else return status;
};

export function PositionsList({ positions, type }: { positions: BasePosition[]; type: string }) {
    const theme = useMantineTheme();
    /* eslint-disable react/jsx-key */
    const tableData =
        type === "open"
            ? {
                  titles: [
                      "Coin",
                      <Text size="sm" color="dimmed" align="left" weight={500}>
                          Direction
                      </Text>,
                      "Status",
                      <Text size="sm" color="dimmed" align="right" weight={500}>
                          Entry
                      </Text>,
                      <Text size="sm" color="dimmed" align="right" weight={500}>
                          Amount
                      </Text>,
                      <Text size="sm" color="dimmed" align="right" weight={500}>
                          Unrealized Profit / Loss
                      </Text>
                  ],
                  rows: positions.map((p) => {
                      return {
                          id: p.id,
                          values: [
                              <Group spacing={0} position="center">
                                  <CoinIcon src={p.robot?.asset || p.asset} />
                              </Group>,
                              <PositionDirectionLabel direction={p.direction} />, // direction
                              <Group spacing={0} position="center">
                                  <Badge size="lg" color={getPositionStatusColor(p.status)}>
                                      {getPositionStatusText(p.status)}
                                  </Badge>
                              </Group>, // status
                              <Stack spacing={0} align="flex-end">
                                  <Text size="md" weight={500} align="center">
                                      ${p.entryPrice}
                                  </Text>
                                  <Text size="xs" align="center">
                                      {dayjs.utc(p.entryDate).format("YYYY-MM-DD HH:mm:ss UTC")}
                                  </Text>
                              </Stack>, // entry
                              <Text size="md" weight={500} align="right">
                                  {`${p.volume} ${p.robot?.asset || p.asset}`}
                              </Text>, // volume
                              <Text
                                  size="md"
                                  weight={500}
                                  color={p.profit && p.profit > 0 ? "teal" : "red"}
                                  align="right"
                              >
                                  {plusNum(p.profit)}
                              </Text> // profit
                          ]
                      };
                  })
              }
            : {
                  titles: [
                      "Coin",
                      <Text size="sm" color="dimmed" align="left" weight={500}>
                          Direction
                      </Text>,
                      "Status",
                      <Text size="sm" color="dimmed" align="right" weight={500}>
                          Entry
                      </Text>,
                      <Text size="sm" color="dimmed" align="right" weight={500}>
                          Exit
                      </Text>,
                      <Text size="sm" color="dimmed" align="right" weight={500}>
                          Amount
                      </Text>,
                      <Text size="sm" color="dimmed" align="right" weight={500}>
                          Profit / Loss
                      </Text>
                  ],
                  rows: positions.map((p) => {
                      return {
                          id: p.id,
                          values: [
                              <Group spacing={0} position="center">
                                  <CoinIcon src={p.robot?.asset || p.asset} />
                              </Group>,
                              <PositionDirectionLabel direction={p.direction} />, // direction
                              <Group spacing={0} position="center">
                                  <Badge size="lg" color={getPositionStatusColor(p.status)}>
                                      {getPositionStatusText(p.status)}
                                  </Badge>
                              </Group>, // status
                              <Stack spacing={0} align="flex-end">
                                  <Text size="md" weight={500} align="right">
                                      ${p.entryPrice}
                                  </Text>
                                  <Text size="xs" align="right">
                                      {dayjs.utc(p.entryDate).format("YYYY-MM-DD HH:mm:ss UTC")}
                                  </Text>
                              </Stack>, // entry
                              <Stack spacing={0} align="flex-end">
                                  <Text size="md" weight={500} align="right">
                                      {p.exitPrice && `$${p.exitPrice}`}
                                  </Text>
                                  <Text size="xs" align="right">
                                      {p.exitDate && dayjs.utc(p.exitDate).format("YYYY-MM-DD HH:mm:ss UTC")}
                                  </Text>
                              </Stack>, // exit
                              <Text size="md" weight={500} align="right">
                                  {`${p.volume} ${p.robot?.asset || p.asset}`}
                              </Text>, // volume
                              <Text
                                  size="md"
                                  weight={500}
                                  color={p.profit && p.profit > 0 ? "teal" : "red"}
                                  align="right"
                              >
                                  {plusNum(p.profit)}
                              </Text> // profit
                          ]
                      };
                  })
              };
    /* eslint-enable react/jsx-key */

    return <ResponsiveTable data={tableData} breakpoint="lg" />;
}
