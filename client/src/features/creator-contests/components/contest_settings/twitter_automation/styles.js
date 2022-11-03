import styled from 'styled-components'

export const TwitterWrap = styled.div`
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
export const ParamsWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 20px auto;
    grid-gap: 20px;
    > * {
        margin-bottom: 30px;
    }
`

export const Parameter = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    align-items: center;
`

export const LinkTwitterWrap = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    position: relative;
`
export const ConnectWalletButton = styled.button`
    border: none;
    border-radius: 10px;
    padding: 10px 15px;
    background-color: rgb(83,155,245);
    color: black;
    font-weight: bold;
    &:hover{
        background-color: rgba(83,155,245,0.8)
    }
`