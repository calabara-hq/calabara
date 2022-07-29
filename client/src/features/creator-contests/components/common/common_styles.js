import styled, { keyframes, css } from 'styled-components'

const fade_in = keyframes`
    0% {opacity: 0}
    100% {opacity: 1}
`


const Contest_h2 = styled.h2`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#d3d3d3'};
    font-size: 30px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`

const Contest_h3 = styled.h3`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#d3d3d3'};
    font-size: 20px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`
const Contest_h4 = styled.h4`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#d3d3d3'};
    font-size: 18px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`

// labels for status and prompt labels

const Label = styled.span`
    background-color: ${props => props.color.background};
    color: ${props => props.color.text};
    border: none;
    border-radius: 4px;
    padding: 2px 10px;
    width: fit-content;
    
`
const submission_fade = keyframes`
    0% {
        max-height: 30ch;
        overflow: hidden;
        opacity: 0;
    }

    100% {
        max-height: 100%;
        overflow: none;
        opacity: 1;
        }
`
const TagType = styled.span`
    background-color: ${props => props.type === 'erc721' ? 'rgba(155, 89, 182, 0.3)' : props.type === 'erc20' ? 'rgba(26, 188, 156, 0.3)' : 'rgba(173, 156, 220, 0.3)'};
    color: ${props => props.type === 'erc721' ? 'rgb(155, 89, 182)' : props.type === 'erc20' ? 'rgb(26, 188, 156)' : 'rgb(173, 156, 220)'};

`

const SettingsSectionSubHeading = styled.div`
    width: 90%;
    margin: 0 auto;
    animation: ${fade_in} 0.6s ease-in-out;
`

const labelColorOptions = [
    { text: 'rgb(234, 203, 195)', background: 'rgba(234, 203, 195,0.3)' },
    { text: 'rgb(162, 114, 141)', background: 'rgba(162, 114, 141, 0.3)' },
    { text: 'rgb(104, 160, 170)', background: 'rgba(104, 160, 170, 0.3)' },
    { text: 'rgb(111, 208, 140)', background: 'rgba(111, 208, 140, 0.3)' },
]


const ERC20Button = styled.button`
    background-color: rgba(26,188,156,0.3);
    color: rgb(26,188,156);
    border: none;
    border-radius: 4px;
    font-weight: 550;
    padding: 5px 10px;
    box-shadow: 0 6px 20px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    &:hover{
        background-color: rgba(26,188,156,0.2);
    }

`

const ERC721Button = styled.button`
    background-color: rgba(155, 89, 182, 0.3);
    color: rgb(155, 89, 182);
    border: none;
    border-radius: 4px;
    font-weight: 550;
    padding: 5px 10px;
    box-shadow: 0 6px 20px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    margin-left: 10px;
    &:hover{
        background-color: rgba(155, 89, 182, 0.2);
    }
`
const ConfirmButton = styled.button`
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: 0;
    color: black;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    background-color: rgb(6, 214, 160);
    
    &:disabled{
        cursor: not-allowed;
        color: darkgrey;
        background-color: #efefef4d;
    }
`
const ErrorMessage = styled.div`
    background-color: rgba(235, 87, 87, 0.3);
    color: rgb(235, 87, 87);
    border-radius: 8px;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 10px;

    & > p {
        margin: 0;
    }
`

export { fade_in, Contest_h2, Contest_h3, Contest_h4, Label, submission_fade, TagType, SettingsSectionSubHeading, labelColorOptions, ERC20Button, ERC721Button, ConfirmButton, ErrorMessage }