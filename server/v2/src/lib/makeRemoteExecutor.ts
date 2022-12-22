import { fetch } from 'cross-fetch';
import { print } from 'graphql';
import type { AsyncExecutor } from "@graphql-tools/utils";

const makeRemoteExecutor: (serviceUrl: string) => AsyncExecutor = (
    serviceUrl: string
) => async ({ document, variables }) => {
    const query = print(document);
    const result = await fetch(serviceUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });
    return result.json();
};

export default makeRemoteExecutor;