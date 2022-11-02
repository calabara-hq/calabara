import styled from 'styled-components'
import { scaleElement } from '../../css/scale-element'

export const LinkTwitterButton = styled.button`
    background-color: rgba(29, 155, 240, 0.8);
    border: none;
    border-radius: 10px;
    width: 200px;
    padding: 10px 20px;
    font-weight: bold;
    ${scaleElement}
    &:hover{
        //background-color: rgba(29, 155, 240)
    }
`

export const RetryWrap = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    gap: 20px;
    justify-content: center;
    align-items: center;
`