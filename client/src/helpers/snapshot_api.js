import fetch from 'cross-fetch'
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  gql,
  createHttpLink
} from "@apollo/client";

import { RetryLink } from '@apollo/client/link/retry'


const createClient = () => {
  const http = createHttpLink({
    uri: 'https://hub.snapshot.org/graphql',
    fetch,
  });

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true
    },
    attempts: {
      max: 10,
      retryIf: (error, _operation) => !!error
    }
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([retryLink, http])
  })

}




const getProposals = async (client, ens, proposalState, count) =>{
  const result = await client.query({
    variables: {ens: ens, proposalState: proposalState, count: count },
    query: gql`
      query Proposals($ens: String!, $proposalState: String!, $count: Int!) {
    proposals (
      first: $count,
      skip: 0,
      where: {
        space_in: [$ens],
        state: $proposalState
      },
      orderBy: "end",
      orderDirection: desc
    ) {
      id
      title
      start
      end
      state
    }
  }
    `
  })
  return result.data.proposals
}


// get all proposals that a user voted on. we can use this to compare with active proposals
const getAllVotes = async (client, ens, walletAddress) =>{
  const result = await client.query({
    variables: {ens: ens, walletAddress: walletAddress},
    query: gql`
    query Votes($ens: String!, $walletAddress: String!) {
      votes (
        first: 1000
        skip: 0
        where: {
          space_in: [$ens],
          voter: $walletAddress
        }
        orderBy: "created",
        orderDirection: desc
      ) {
        proposal{
          id
        }
      }
    }
    `
  })
  return result.data.votes
}


// get the number of votes for a single proposal
const getSingleProposalVotes = async (client, proposal_id) => {
  const result = await client.query({
    variables: {proposal_id: proposal_id},
    query: gql`
    query Votes($proposal_id: String!) {
      votes (
        first: 1000
        skip: 0
        where: {
          proposal: $proposal_id
        }
        orderBy: "created",
        orderDirection: desc
      ) {
        proposal{
          id
        }
      }
    }
    `
  })
  return result.data.votes
}

const getSpace = async (client, ens) => {
  const result = await client.query({
    variables: {ens: ens},
    query: gql`
    query Space($ens: String!){
      space(id: $ens) {
        id
        name
        about
        network
        symbol
        members
      }
    }
    `
  })
  return result.data.space
}



// for all active proposals, check if the address voted
// 1. get all active proposals for a space.
// 2. get proposals(active and closed) this user voted on
// 3. remove voted on from active
// 4. return remaining active proposals which a user hasn't voted on

const didAddressVote = async(client, ens, walletAddress) =>{
  var proposals = await getProposals(client, ens, 'active', 1000)
  var votes = await getAllVotes(client, ens, walletAddress)
  votes = votes.map(el => el.proposal.id)

  // map voted proposals to a 1D array

  
  
  let alter = JSON.parse(JSON.stringify(votes))
  let removed = alter.splice(2,1)
  const active_unvoted = proposals.filter((el) => !alter.includes(el.id))

  return active_unvoted

}

// get all proposals. get all proposals this user voted on. participation = proposals/voted on
const userParticipation = async(client, ens, walletAddress) =>{
  var proposals = await getProposals(client, ens, 'all', 1000)
  var votes = await getAllVotes(client, ens, walletAddress)
  votes = votes.map(el => el.proposal.id)

  const participation = (votes.length / proposals.length) * 100;
  return participation

}

// get average org-wide voter turnout over the last 5 proposals
const globalParticipation = async(client, ens) =>{
  const space = await getSpace(client, ens)
  
  var proposals = await getProposals(client, ens, 'all', 5)
  var proposal_ids = proposals.map(el => el.id)
  var numVotes = []
  
  for(var id in proposal_ids){
    const numVoters = await getSingleProposalVotes(client, proposal_ids[id])
    numVotes.push(numVoters.length)
  }

  

}


export { createClient, getSpace, getProposals, didAddressVote, userParticipation, globalParticipation };
