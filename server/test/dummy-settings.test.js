let settings = {
    "date_times": {
        "start_date": "2022-08-30T00:10:07.514Z",
        "voting_begin": "2022-08-30T00:10:07.514Z",
        "end_date": "2022-08-30T00:10:07.514Z"
    },
    "reward_options": {
        "ETH": {
            "type": "ETH",
            "symbol": "ETH",
            "img": "eth"
        }
    },
    "submitter_rewards": {
        "0": {
            "rank": 1,
            "eth": {
                "amount": 12,
                "contract": null,
                "symbol": "ETH"
            }
        }
    },
    "voter_rewards": [],
    "submitter_restrictions": {
        "0": {
            "type": "erc20",
            "symbol": "SHARK",
            "address": "0x232AFcE9f1b3AAE7cb408e482E847250843DB931",
            "decimal": "18",
            "threshold": "1"
        },
        "1": {
            "type": "erc721",
            "symbol": "NOUN",
            "address": "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
            "decimal": "0",
            "threshold": "3"
        },
        "2": {
            "type": "erc721",
            "symbol": "MFER",
            "address": "0x79FCDEF22feeD20eDDacbB2587640e45491b757f",
            "decimal": "0",
            "threshold": "1"
        }
    },
    "voter_restrictions": {
        "0": {
            "type": "erc20",
            "symbol": "SHARK",
            "address": "0x232AFcE9f1b3AAE7cb408e482E847250843DB931",
            "decimal": "18",
            "threshold": "1"
        },
        "1": {
            "type": "erc721",
            "symbol": "NOUN",
            "address": "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
            "decimal": "0",
            "threshold": "2"
        },
        "2": {
            "type": "erc721",
            "symbol": "MFER",
            "address": "0x79FCDEF22feeD20eDDacbB2587640e45491b757f",
            "decimal": "0",
            "threshold": "3"
        }
    },
    "voting_strategy": {
        "strategy_type": "token",
        "type": "erc721",
        "symbol": "NOUN",
        "address": "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
        "decimal": "0",
        "hard_cap": 100,
        "sub_cap": 10
    }
}
module.exports = settings