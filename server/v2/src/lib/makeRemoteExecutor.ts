import { fetch } from 'cross-fetch';
import { print } from 'graphql';
import type { AsyncExecutor } from "@graphql-tools/utils";

/*
const makeRemoteExecutor: (serviceUrl: string, options: any) => AsyncExecutor = (
    serviceUrl: string,
    options?: any
) => async ({ document, variables }) => {
    const query = print(document);
    if (options.log) console.log(`# -- OPERATION ${new Date().toISOString()}:\n${query}`);
    const result = await fetch(serviceUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });
    return result.json();
};
*/

const makeRemoteExecutor: (url: string) => AsyncExecutor = (
    url: string
) => {
    return async ({ document, variables }) => {
        const query = typeof document === 'string' ? document : print(document)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        })
        return response.json()
    }
}

export default makeRemoteExecutor;