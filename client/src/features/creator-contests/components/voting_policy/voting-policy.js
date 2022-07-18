import styled from 'styled-components'
import { Contest_h2 } from '../common/common_styles'


const VotingPolicyWrap = styled.div`
    display: flex;
    flex-direction: column;
`


export default function VotingPolicy({}){

    return(
        <VotingPolicyWrap>
            <Contest_h2>Voting Policy</Contest_h2>
        </VotingPolicyWrap>
    )
}