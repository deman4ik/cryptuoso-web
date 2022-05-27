import { Select } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { RefreshDot, RefreshOff } from "tabler-icons-react";

export function RefreshRate({ value, setValue }: { value: string | null; setValue: Dispatch<SetStateAction<string>> }) {
    return (
        <Select
            icon={value === "off" ? <RefreshOff size={18} /> : <RefreshDot size={18} />}
            value={value}
            onChange={(e) => {
                if (e) setValue(e);
            }}
            size="xs"
            mt={0}
            pt={0}
            sx={{ width: "85px" }}
            data={[
                { value: "off", label: "Off" },
                { value: "1m", label: "1m" },
                { value: "5m", label: "5m" },
                { value: "15m", label: "15m" },
                { value: "30m", label: "30m" },
                { value: "1h", label: "1h" }
            ]}
        />
    );
}
