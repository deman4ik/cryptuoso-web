import React from "react";
import { Provider } from "urql";
import useClient from "./client";

interface GraphqlProviderProps {
    children: React.ReactNode;
}

const GraphqlProvider: React.FC<GraphqlProviderProps> = ({ children }) => {
    const client = useClient();

    return <Provider value={client}>{children}</Provider>;
};

export default GraphqlProvider;
