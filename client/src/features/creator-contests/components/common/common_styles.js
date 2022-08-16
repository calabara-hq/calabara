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

const Contest_h2_alt = styled.h2`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#d9d9d9'};
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
const Contest_h3_alt = styled.h3`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#d9d9d9'};
    font-size: 24px;
    //margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`
const Contest_h3_alt_small = styled.h3`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#b3b3b3'};
    font-size: 20px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`

const Contest_h4 = styled.h4`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#b3b3b3'};
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
    background-color: ${props => props.type === 'erc721' ? '$ab6afb' : props.type === 'erc20' ? '#03b09f' : '#ecf0f1'};
    color: ${props => props.type === 'erc721' ? '#f2f2f2' : props.type === 'erc20' ? '#f2f2f2' : '#3c3c3d'};

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
const ERC20Button_alt = styled.button`
    background-color: rgb(3 176 159 / 40%);
    color: #03b09f;
    border: none;
    border-radius: 4px;
    font-weight: 550;
    padding: 5px 10px;
    box-shadow: 0 6px 20px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    &:hover{
        background-color: rgb(3 176 159 / 40%);
        color: #d9d9d9;
    }

`

const ERC721Button_alt = styled.button`
    background-color: rgb(171 106 251 / 40%);
    color: #ab6afb;
    border: none;
    border-radius: 4px;
    font-weight: 550;
    padding: 5px 10px;
    box-shadow: 0 6px 20px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    margin-left: 10px;
    &:hover{
        background-color: #ab6afb;
        color: #d9d9d9;
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

export { fade_in, Contest_h2, Contest_h2_alt, Contest_h3, Contest_h3_alt, Contest_h3_alt_small, Contest_h4, Label, submission_fade, TagType, SettingsSectionSubHeading, labelColorOptions, ERC20Button, ERC20Button_alt, ERC721Button, ERC721Button_alt, ConfirmButton, ErrorMessage }