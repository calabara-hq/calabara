export const ERC165ABI = [
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
            },
        ],
        name: "supportsInterface",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
]

export const ERC1155Interface = "0xd9b67a26";
export const ERC721Interface = "0x80ac58cd";