let sample_settings = {
    "date_times": {
        "start_date": "2022-09-08T17:32:01.281Z",
        "voting_begin": "2022-09-08T17:50:00.000Z",
        "end_date": "2022-09-08T18:32:00.000Z"
    },
    "reward_options": {
        "eth": {
            "type": "eth",
            "symbol": "ETH",
            "img": "eth",
            "contract": null,
            "selected": true
        }
    },
    "submitter_rewards": [
        {
            "rank": 1,
            "eth": {
                "type": "eth",
                "symbol": "ETH",
                "address": null,
                "amount": 1
            }
        }
    ],
    "voter_rewards": [
        {
            "erc20": {
                "type": "erc20",
                "symbol": "SHARK",
                "address": "0x232AFcE9f1b3AAE7cb408e482E847250843DB931",
                "decimal": "18",
                "amount": 1000
            },
            "rank": 1
        }
    ],
    "submitter_restrictions": {
        "0": {
            "type": "erc20",
            "symbol": "SHARK",
            "address": "0x232AFcE9f1b3AAE7cb408e482E847250843DB931",
            "decimal": "18",
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
        }
    },
    "voting_strategy": {
        "strategy_type": "token",
        "type": "erc20",
        "symbol": "SHARK",
        "address": "0x232AFcE9f1b3AAE7cb408e482E847250843DB931",
        "decimal": "18",
        "hard_cap": 0,
        "sub_cap": 0
    },
    "anon_subs": false,
    "visible_votes": false,
    "self_voting": false
}

export default sample_settings