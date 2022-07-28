import { Chip } from "@mantine/core";
import { Option, PortfolioOptions } from "@cryptuoso/types";
import { Dispatch, SetStateAction } from "react";
import { getOptionName } from "@cryptuoso/helpers";

export function OptionsPicker({ options, setOptions }: { options: Option[]; setOptions: (options: Option[]) => void }) {
    const chips = ["efficiency", "moneyManagement", "profit", "risk", "winRate"].map((value) => (
        <Chip value={value} key={value} size="md">
            {getOptionName(value as keyof PortfolioOptions)}
        </Chip>
    ));
    return (
        <Chip.Group
            multiple={true}
            value={options}
            onChange={(val) => {
                if (!val.length) {
                    val = ["profit"];
                }
                setOptions(val as Option[]);
            }}
        >
            {chips}
        </Chip.Group>
    );
}
