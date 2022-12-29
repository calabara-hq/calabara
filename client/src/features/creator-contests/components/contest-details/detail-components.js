import {
    DetailContainer,
    RewardRow,
    VoterRow,
    DetailWrap
} from './detail-style'
import { TagType } from '../common/common_styles';


export const ContestDateDetails = ({ date_times, snapshot_timestamp }) => {
    const readableStart = new Date(date_times.start_date);
    const readableVote = new Date(date_times.voting_begin);
    const readableEnd = new Date(date_times.end_date);
    const readableSnapshot = new Date(snapshot_timestamp);

    return (
        <div>
            <p>Start: {readableStart.toLocaleDateString() + ' ' + readableStart.toLocaleTimeString()}</p>
            <p>Vote: {readableVote.toLocaleDateString() + ' ' + readableVote.toLocaleTimeString()}</p>
            <p>End: {readableEnd.toLocaleDateString() + ' ' + readableEnd.toLocaleTimeString()}</p>
            <p>Snapshot {readableSnapshot.toLocaleDateString() + ' ' + readableSnapshot.toLocaleTimeString()}</p>
        </div>
    )
}



export const SubmitterRewardDetails = ({ submitter_rewards }) => {
    if (submitter_rewards.length > 0) {
        return (
            <DetailContainer>
                {submitter_rewards.map((reward, idx) => {
                    return (
                        <RewardRow key={idx}>
                            <p><b>rank {reward.rank}:</b></p>
                            {reward.eth ? <p>{reward.eth.amount} ETH</p> : null}
                            {reward.erc20 ? <p style={{ marginLeft: '30px' }}>{reward.erc20.amount} {reward.erc20.symbol}</p> : null}
                            {reward.erc721 ? <p style={{ marginLeft: '30px' }}>1 {reward.erc721.symbol} </p> : null}

                        </RewardRow>
                    )
                })}
            </DetailContainer>
        )
    }

    return <p><b>There are no submitter rewards defined for this contest.</b></p>
}


export const VoterRewardDetails = ({ voter_rewards }) => {
    if (voter_rewards.length > 0) {
        return (
            <DetailContainer>
                {voter_rewards.map((reward, idx) => {
                    return (
                        <RewardRow key={idx}>
                            {reward.eth ? <p>Voters that accurately choose the rank {reward.rank} submission will <b>split </b>{reward.eth.amount} ETH</p> : null}
                            {reward.erc20 ? <p>Voters that accurately choose the rank {reward.rank} submission will <b>split </b>{reward.erc20.amount} {reward.erc20.symbol}</p> : null}
                        </RewardRow>
                    )
                })}
            </DetailContainer>
        )
    }

    return <p><b>There are no voter rewards defined for this contest.</b></p>

}

export const SubmitterRestrictionDetails = ({ submitter_restrictions }) => {
    if (submitter_restrictions.length > 0) {
        return (
            <DetailContainer>
                {submitter_restrictions.map((restriction, idx) => {
                    return (
                        <RewardRow key={idx}>
                            <p>Type: <TagType type={restriction.type}>{restriction.type}</TagType></p>
                            <p>Symbol: {restriction.symbol}</p>
                            <p>Threshold: {restriction.threshold}</p>
                        </RewardRow>
                    )
                })}
            </DetailContainer>
        )
    }

    return <p><b>Anyone can submit</b></p>
}

export const VoterRestrictionDetails = ({ voter_restrictions }) => {
    if (voter_restrictions.length > 0) {
        return (
            <DetailContainer>
                {voter_restrictions.map((restriction, idx) => {
                    return (
                        <RewardRow key={idx}>
                            <p>Type: <TagType type={restriction.type}>{restriction.type}</TagType></p>
                            <p>Symbol: {restriction.symbol}</p>
                            <p>Threshold: {restriction.threshold}</p>
                        </RewardRow>
                    )
                })}
            </DetailContainer>
        )
    }
    return <p><b>Anyone can vote</b></p>

}



export const VotingPolicyDetails = ({ voting_strategy }) => {
    if (voting_strategy.strategy_type === 'token') return <TokenComponent voting_strategy={voting_strategy} />
    return <ArcadeComponent voting_strategy={voting_strategy} />

}


export const AdditionalConfigDetails = ({ visible_votes, anon_subs, self_voting }) => {
    return (
        <DetailContainer>
            <h4>Additional Configs</h4>
            <li>Votes <b>{visible_votes ? 'are' : 'not'}</b> visible during voting</li>
            <li>Submitters will be <b>{anon_subs ? 'anonymous' : 'visible'}</b> throughout the contest</li>
            <li>Voters can <b>{self_voting ? '' : 'not'}</b> vote on themselves</li>
        </DetailContainer>
    )
}





const TokenComponent = ({ voting_strategy }) => {

    return (
        <VoterRow>
            <p><b>{voting_strategy.strategy_type} strategy</b></p>
            <li>Type: <b>{voting_strategy.symbol}</b> <TagType type={voting_strategy.type}>{voting_strategy.type}</TagType></li>
            <li>1 <b>{voting_strategy.symbol}</b> equals 1 <b>voting credit</b></li>
            {voting_strategy.hard_cap > 0 &&
                <li>Contest hard cap: <b>{voting_strategy.hard_cap}</b></li>
            }
            {voting_strategy.sub_cap > 0 &&
                <li>Submission hard cap: <b>{voting_strategy.sub_cap}</b></li>
            }

        </VoterRow>

    )



}

const ArcadeComponent = ({ voting_strategy }) => {


    return (
        <VoterRow>
            <p><b>{voting_strategy.strategy_type} strategy</b></p>
            <li>Total Votes: <b>{voting_strategy.hard_cap}</b></li>
            {voting_strategy.sub_cap > 0 &&
                <li>Submission hard cap: <b>{voting_strategy.sub_cap}</b></li>
            }
        </VoterRow>
    )


}


export default function ContestSummaryComponent({ contest_settings }) {
    return (
        <>
            <h3>Summary</h3>
            <DetailWrap>
                <ContestDateDetails date_times={contest_settings.date_times} snapshot_timestamp={contest_settings.snapshot_timestamp} />
            </DetailWrap>
            <DetailWrap>
                <h4>Submitter Rewards</h4>
                <SubmitterRewardDetails submitter_rewards={contest_settings.submitter_rewards} />
            </DetailWrap>
            <DetailWrap>
                <h4>Voter Rewards</h4>
                <VoterRewardDetails voter_rewards={contest_settings.voter_rewards} />
            </DetailWrap>
            <DetailWrap>
                <h4>Submitter Restrictions</h4>
                <SubmitterRestrictionDetails submitter_restrictions={contest_settings.submitter_restrictions} />
            </DetailWrap>
            <DetailWrap>
                <h4>Voter Restrictions</h4>
                <VoterRestrictionDetails voter_restrictions={contest_settings.voter_restrictions} />
            </DetailWrap>
            <DetailWrap>
                <h4>Voting Policy</h4>
                <VotingPolicyDetails voting_strategy={contest_settings.voting_strategy} />
            </DetailWrap>
            <DetailWrap>
                <AdditionalConfigDetails visible_votes={contest_settings.visible_votes} anon_subs={contest_settings.anon_subs} self_voting={contest_settings.self_voting} />
            </DetailWrap>

        </>
    )
}