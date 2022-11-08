import styled, { keyframes, css } from 'styled-components'

export const fade_in = keyframes`
    0% {opacity: 0}
    100% {opacity: 1}
`
export const fade_out = keyframes`
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
`


export const Contest_h2 = styled.h2`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#d3d3d3'};
    font-size: 30px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`

export const Contest_h2_alt = styled.h2`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#d9d9d9'};
    font-size: 30px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`

export const Contest_h3 = styled.h3`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#d3d3d3'};
    font-size: 20px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`
export const Contest_h3_alt = styled.h3`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#d9d9d9'};
    font-size: 24px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`
export const Contest_h3_alt_small = styled.h3`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#b3b3b3'};
    font-size: 20px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`

export const Contest_h4 = styled.h4`
    grid-area: ${props => props.grid_area ? props.grid_area : ''};
    color: ${props => props.color ? props.color : '#b3b3b3'};
    font-size: 18px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`

// labels for status and prompt labels

export const Label = styled.span`
    background-color: ${props => props.color.background};
    color: ${props => props.color.text};
    border: none;
    border-radius: 4px;
    padding: 2px 10px;
    width: fit-content;
    
`
export const submission_fade = keyframes`
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

export const TagType = styled.span`

    ${props => props.type === 'erc20' && ({
        backgroundColor: '#1e1e1e',
        color: '#03b09f',
        border: '1px solid #03b09f'
    })}

    ${props => props.type === 'erc721' && ({
            backgroundColor: '#1e1e1e',
            color: '#ab6afb',
            border: '1px solid #ab6afb'
        })}

    ${props => props.type === 'erc1155' && ({
            backgroundColor: '#1e1e1e',
            color: '#6673ff',
            border: '1px solid #6673ff'
        })}
`


export const SettingsSectionSubHeading = styled.div`
    width: 90%;
    margin: 0 auto;
    animation: ${fade_in} 0.6s ease-in-out;
`

export const labelColorOptions = [
    { text: 'rgb(234, 203, 195)', background: 'rgba(234, 203, 195,0.3)' },
    { text: 'rgb(162, 114, 141)', background: 'rgba(162, 114, 141, 0.3)' },
    { text: 'rgb(104, 160, 170)', background: 'rgba(104, 160, 170, 0.3)' },
    { text: 'rgb(111, 208, 140)', background: 'rgba(111, 208, 140, 0.3)' },
]


export const ConfirmButton = styled.button`
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

export const ConfirmButtonAlt = styled.button`
    position: absolute;
    bottom: 0;
    right: 0;
    height: 40px;
    font-size: 15px;
    font-weight: 550;
    color: rgb(6, 214, 160);
    background-color: rgb(6, 214, 160, .3);
    border: 2px solid rgb(6, 214, 160, .3);
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 20px;
    //margin-right: 30px;

    &:hover{
        background-color: rgb(6, 214, 160);
        color: #fff;
    
    }

    &:disabled{
    cursor: not-allowed;
    color: rgb(6,214,160, .3);
    background-color: #262626;

    }

`

export const ErrorMessage = styled.div`
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

export const WarningMessage = styled.div`
    background: rgba(242, 201, 77, 0.3);
    color: rgb(242, 201, 77);
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

