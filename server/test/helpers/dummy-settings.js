let base_settings = {
    date_times: {
        start_date: null,
        voting_begin: null,
        end_date: null
    },
    reward_options: {
        ETH: {
            type: "ETH",
            symbol: "ETH",
            img: "eth"
        }
    },
    submitter_rewards: null,
    voter_rewards: [],
    submitter_restrictions: null,
    voter_restrictions: null,
    voting_strategy: null,
    anon_subs: false,
    visible_votes: false,
    self_voting: false,
    snapshot_block: '2022-09-29T23:46:06.126Z'
}



let test_token_strategies = [
    {
        strategy_type: 'token',
        type: 'erc721',
        symbol: 'NOUN',
        address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
        decimal: 0,
        sub_cap: 0,
        hard_cap: 0,
    },
    
    {
        strategy_type: 'token',
        type: 'erc20',
        symbol: 'SAFE',
        address: '0x5aFE3855358E112B5647B952709E6165e1c1eEEe',
        decimal: 18,
        sub_cap: 0,
        hard_cap: 0,
    },
    {
        strategy_type: 'token',
        type: 'erc20',
        symbol: 'SHARK',
        address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
        decimal: 18,
        sub_cap: 10,
        hard_cap: 8,
    },
    {
        strategy_type: 'token',
        type: 'erc20',
        symbol: 'SHARK',
        address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
        decimal: 18,
        sub_cap: 10,
        hard_cap: 50,
    },
    
]

let test_arcade_strategies = [
    {
        strategy_type: 'arcade',
        sub_cap: 0,
        hard_cap: 50,
    },
    {
        strategy_type: 'arcade',
        sub_cap: 10,
        hard_cap: 50,
    },
    {
        strategy_type: 'arcade',
        sub_cap: 0,
        hard_cap: 0,
    },
]

let test_voter_restrictions = [
    {
        0: {
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 18,
            threshold: 1
        },
        1: {
            strategy_type: 'token',
            type: 'erc20',
            symbol: 'SAFE',
            address: '0x5aFE3855358E112B5647B952709E6165e1c1eEEe',
            decimal: 18,
            sub_cap: 0,
            hard_cap: 0,
        },
        2: {
            type: 'erc721',
            symbol: 'NOUN',
            address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
            decimal: 0,
            threshold: 2
        },
        3: {
            type: 'erc721',
            symbol: 'MFER',
            address: '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',
            decimal: 0,
            threshold: 3
        }
    },


    {
        0: {
            type: 'erc721',
            symbol: 'NOUN',
            address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
            decimal: 0,
            threshold: 2
        },
        1: {
            type: 'erc721',
            symbol: 'MFER',
            address: '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',
            decimal: 0,
            threshold: 3
        }
    }
]

let test_submitter_restrictions = [
    {
        0: {
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 0,
            threshold: 1
        },
        1: {
            type: 'erc721',
            symbol: 'NOUN',
            address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
            decimal: 0,
            threshold: 2
        },
        2: {
            type: 'erc721',
            symbol: 'MFER',
            address: '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',
            decimal: 0,
            threshold: 3
        }
    },

    {
        0: {
            type: 'erc721',
            symbol: 'NOUN',
            address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
            decimal: 0,
            threshold: 2
        },
        1: {
            type: 'erc721',
            symbol: 'MFER',
            address: '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',
            decimal: 0,
            threshold: 3
        }
    }
]


module.exports = { base_settings, test_token_strategies, test_arcade_strategies, test_voter_restrictions, test_submitter_restrictions }