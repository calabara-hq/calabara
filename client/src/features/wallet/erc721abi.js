module.exports.erc721abi = [
    {
        'inputs': [{ 'internalType': 'address', 'name': 'owner', 'type': 'address' }],
        'name': 'balanceOf',
        'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
        'payable': false, 'stateMutability': 'view', 'type': 'function', 'constant': true
    },
    {
        'inputs': [],
        'name': 'name',
        'outputs': [{ 'internalType': 'string', 'name': '', 'type': 'string' }],
        'stateMutability': 'view', 'type': 'function', 'constant': true
    },
    {
        'inputs': [{ 'internalType': 'uint256', 'name': 'tokenId', 'type': 'uint256' }],
        'name': 'ownerOf',
        'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }],
        'payable': false, 'stateMutability': 'view', 'type': 'function', 'constant': true
    },
    {
        'inputs': [],
        'name': 'symbol',
        'outputs': [{ 'internalType': 'string', 'name': '', 'type': 'string' }],
        'stateMutability': 'view', 'type': 'function', 'constant': true
    },
    {
        'inputs': [],
        'name': 'totalSupply',
        'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
        'stateMutability': 'view', 'type': 'function', 'constant': true
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
]

