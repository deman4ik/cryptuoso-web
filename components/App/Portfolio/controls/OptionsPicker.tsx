import { Chip, Chips } from "@mantine/core";
import { Option, PortfolioOptions } from "@cryptuoso/types";
import { Dispatch, SetStateAction } from "react";
import { getOptionName } from "@cryptuoso/helpers";

export function OptionsPicker({ options, setOptions }: { options: Option[]; setOptions: (options: Option[]) => void }) {
    const chips = ["efficiency", "moneyManagement", "profit", "risk", "winRate"].map((value) => (
        <Chip value={value} key={value}>
            {getOptionName(value as keyof PortfolioOptions)}
        </Chip>
    ));
    return (
        <Chips
            multiple={true}
            value={options}
            onChange={(val) => {
                if (!val.length) {
                    val = ["profit"];
                }
                setOptions(val as Option[]);
            }}
            size="md"
        >
            {chips}
        </Chips>
    );
}
