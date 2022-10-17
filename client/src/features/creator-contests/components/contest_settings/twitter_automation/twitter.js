import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react"
import styled from 'styled-components'
import useTwitterAuth from "../../../../hooks/useTwitterAuth";
import { ToggleButton } from "../../common/common_components";
import { Contest_h3_alt } from "../../common/common_styles";

const TwitterWrap = styled.div`
    display: flex;
    flex-direction: column;
    &::before{
        content: '${props => props.title}';
        position: absolute;
        transform: translate(0%, -150%);
        color: #f2f2f2;
        font-size: 30px;
    }
    
    
`
const ParamsWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 20px auto;
    grid-gap: 20px;
    > * {
        margin-bottom: 30px;
    }
`

const Parameter = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    align-items: center;
`

const LinkTwitterButton = styled.button`
    background-color: rgb(29, 155, 240);
    border: none;
    border-radius: 10px;
    width: 200px;
    padding: 10px 20px;
    font-weight: bold;
    &:hover{
        background-color: rgba(29, 155, 240, 0.8)
    }
`

const LinkTwitterWrap = styled.div`
    display: flex;
    align-items: center;
`


const LinkedAccount = styled.div`
    display: flex;
    margin-left: 100px;
    background-color: rgba(29, 155, 240, 0.8);
    border-radius: 10px;
    font-weight: bold;
    padding: 10px;
    align-items: flex-end;

    > img{
        border-radius: 100px;
        max-width: 10em;
        margin-right: 10px;
    }
`


export default function Twitter({ }) {
    const [isToggleOn, setIsToggleOn] = useState(false);
    const { authState, accountInfo, getAuthLink, onOpen } = useTwitterAuth();
    const [masterTweet, setMasterTweet] = useState('');

    const toggleTwitter = () => {
        if (!isToggleOn) getAuthLink()
        setIsToggleOn(!isToggleOn)
    }

    const updateMasterTweet = (e) => {
        setMasterTweet(e.target.value)
    }

    return (
        <TwitterWrap title={"Twitter Integration"}>
            <ParamsWrap>
                <Parameter>
                    <Contest_h3_alt>Integrate Twitter</Contest_h3_alt>
                    <ToggleButton identifier={'twitter-toggle'} isToggleOn={isToggleOn} handleToggle={toggleTwitter} />
                    <p style={{ color: '#a3a3a3' }}>Collect submissions via twitter interactions </p>
                    <b></b>
                </Parameter>
                <LinkTwitter onOpen={onOpen} accountInfo={accountInfo} authState={authState} isToggleOn={isToggleOn} />
                <ConfigureIntegration authState={authState} masterTweet={masterTweet} updateMasterTweet={updateMasterTweet} />
            </ParamsWrap>
        </TwitterWrap>
    )
}


function LinkTwitter({ onOpen, accountInfo, authState, isToggleOn }) {
    if (isToggleOn) {
        return (
            <LinkTwitterWrap>
                <LinkTwitterButton onClick={onOpen}><p style={{ marginBottom: '0px' }}><FontAwesomeIcon icon={faTwitter} /> Link Account</p></LinkTwitterButton>
                <RenderAccount accountInfo={accountInfo} authState={authState} />
            </LinkTwitterWrap>
        )
    }

    return null

}


function RenderAccount({ accountInfo, authState }) {
    if (authState === 2) {
        return (
            <LinkedAccount>
                <img src={accountInfo.user.profile_image_url} />
                <p style={{ marginBottom: '0px' }}>@{accountInfo.user.username}</p>
            </LinkedAccount>
        )
    }


    return null
}

function ConfigureIntegration({ authState, masterTweet, updateMasterTweet }) {
    const [subByQuoteToggle, setSubByQuoteToggle] = useState(false);
    const [subRepliesToggle, setSubRepliesToggle] = useState(false);
    if (authState === 2) {
        return (
            <>
                <AnnouncementTweet masterTweet={masterTweet} updateMasterTweet={updateMasterTweet} />
                <Parameter>
                    <Contest_h3_alt>Post submissions as replies</Contest_h3_alt>
                    <ToggleButton identifier={'quote-tweet-toggle'} isToggleOn={subByQuoteToggle} handleToggle={() => { setSubByQuoteToggle(!subByQuoteToggle) }} />
                    <p style={{ color: '#a3a3a3' }}>Post submissions as replies to your announcement tweet</p>
                    <b></b>
                </Parameter>
                <Parameter>
                    <Contest_h3_alt>Submit by Quote Tweet</Contest_h3_alt>
                    <ToggleButton identifier={'replies-toggle'} isToggleOn={subRepliesToggle} handleToggle={() => { setSubRepliesToggle(!subRepliesToggle) }} />
                    <p style={{ color: '#a3a3a3' }}>Allow submissions by quote tweeting your announcement tweet</p>
                    <b></b>
                </Parameter>
            </>
        )
    }

    return null
}



const TextArea = styled.textarea`
  outline: none;
  color: #d3d3d3;
  font-size: 16px;
  border: 2px solid #4d4d4d;
  background-color: #262626;
  border-radius: 10px;
  padding: 10px;
  width: 70%;
  height: 15em;
  
  resize: none;
`
const TextAreaWrap = styled.div`
    &::after{
            content: ${props => `"${props.textLength} / ${props.maxLength} "`};
            color: ${props => props.textLength > props.maxLength ? 'rgb(178, 31, 71)' : ''};
            position: absolute;
            transform: translate(-110%, -100%)
        }
`
const AnnouncementTweetWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

function AnnouncementTweet({ masterTweet, updateMasterTweet }) {
    return (
        <AnnouncementTweetWrap>
            <Parameter>
                <Contest_h3_alt>Announcement Tweet</Contest_h3_alt>
                <b></b>
                <p style={{ color: '#a3a3a3' }}>We'll tweet this for you once you finish setting up the contest</p>
                <b></b>
            </Parameter>
            <TextAreaWrap textLength={masterTweet.length} maxLength={280}>
                <TextArea placeholder='Announcement Tweet' value={masterTweet} onChange={updateMasterTweet}></TextArea>
            </TextAreaWrap>
        </AnnouncementTweetWrap>
    )
}