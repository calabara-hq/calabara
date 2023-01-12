import styled from 'styled-components'
import { fade_in } from '../creator-contests/components/common/common_styles'
import { scaleElement } from '../../css/scale-element'

export const TextAreaWrap = styled.div`
    background-color: orange;
    display: flex;
    flex-direction: column;
    //border: 2px solid #4d4d4d;
    background-color: ${props => props.focused ? '#262626' : 'rgba(26,26,26,0.9)'};
    //border-radius: 10px 10px 10px 10px;
    padding: 10px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
    cursor: pointer;
    overflow: hidden;
`
export const TextArea = styled.textarea`
    outline: none;
    font-size: 16px;
    border: none;
    background-color: transparent;
    border-radius: 10px;
    padding: 10px;
    width: 85%;
    color: ${props => props.focused ? '#d3d3d3' : 'grey'};
    cursor: ${props => props.focused ? 'text' : 'pointer'};
    margin-left: auto;
    resize: none;
    //transition: all 0.3s;
`




export const TextAreaBottom = styled.div`
    //display: flex;
    width: 85%;
    border-top: 1px solid grey;
    margin-left: auto;
    padding: 10px 5px;
    display: ${props => props.focused ? 'flex' : 'none'};
    animation: ${fade_in} 0.2s ease-in-out;
`
export const AddImageButton = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 5px 10px;
    border-radius: 100px;
    font-size: 20px;
    color: ${props => props.disabled ? 'grey' : 'rgba(29, 155, 240)'};
    cursor: ${props => props.disabled ? 'default' : 'pointer'};

    &:hover{
        background-color: ${props => props.disabled ? 'transparent' : 'rgba(29, 155, 240, 0.1)'};
    }
`


export const RightAlignButtons = styled.div`
    display: flex;
    margin-left: auto;
    gap: 10px;
`
export const CharacterLimit = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: none;
    padding: 0px 13px;
    border-radius: 100px;
    background-color: transparent;
    margin-left: auto;
    color: ${props => props.isCharOverflow ? 'rgb(178, 31, 71)' : ''};
`

export const AddTweetButton = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border: none;
    padding: 0px 13px;
    border-radius: 100px;
    background-color: transparent;
    margin-left: auto;
    &:hover{
        background-color: rgba(29, 155, 240, 0.1);
    }
    &:disabled{
        visibility: hidden;
    }
`


export const TweetButton = styled.button`
    background-color: rgba(29, 155, 240, 0.8);
    border: none;
    border-radius: 100px;
    padding: 5px 20px;
    font-weight: bold;
    ${scaleElement};
    &:disabled{
        background-color: rgba(29, 155, 240, 0.5);
        color: grey;
    }

`
export const DeleteTweetButton = styled.div`
    cursor: pointer;
    display: ${props => props.disabled ? 'none' : 'flex'};
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border: none;
    padding: 0px 13px;
    border-radius: 100px;
    background-color: transparent;
    margin-left: auto;
    &:hover{
        background-color: rgba(178,31,71,0.3);
    }
`

export const ThreadWrap = styled.div`
    display: flex;
    flex-direction: column;
`

export const MediaContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 85%;
    margin-left: auto;
    padding-bottom: 20px;
    position: relative;
`

export const TweetMedia = styled.img`
    max-width: 35em;
    grid-area: ${props => props.index};
    border-radius: 20px;
`
export const RemoveMediaButton = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 5px;
    left: 5px;
    border-radius: 100px;
    padding: 5px 10px;
    width: 40px;
    height: 40px;
    background-color: rgb(0, 0, 0, 0.7);
    ${scaleElement};
    &:hover{
        background-color: rgba(178,31,71,0.3);
    }

`


export const LinkedAccount = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    > img{
        border-radius: 100px;
        max-width: 10em;
    }
`

export const ThreadBar = styled.div`
    background-color: #a3a3a3;
    width: 3px;
    height: 60em;
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
`

