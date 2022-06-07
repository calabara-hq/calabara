import styled, {keyframes, css} from 'styled-components'

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
    font-size: 24px;
    margin: 0px;
    animation: ${props => props.animated ? css`${fade_in} 0.6s ease-in-out` : ''};
`

export {Contest_h2, Contest_h3}