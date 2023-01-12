import styled from 'styled-components'

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

export const TokenType = styled.p`
    color: lightgrey;
    margin: 0;

    > span{
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
    }
`


export const ERC20Button = styled.button`
    font-weight: 550;
    background-color: #1e1e1e;
    color: #03b09f;
    border: 2px solid #03b09f;
    border-radius: 4px;
    box-shadow: 0 6px 20px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    padding: 5px 10px;

    &:hover{
        background-color: rgb(3 176 159);
        color: #1e1e1e;
    }

`

export const ERC721Button = styled.button`
    font-weight: 550;
    background-color: #1e1e1e;
    color: #ab6afb;
    border: 2px solid #ab6afb;
    border-radius: 4px;
    box-shadow: 0 6px 20px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    padding: 5px 10px;
    margin-left: 10px;

    &:hover{
        background-color: #ab6afb;
        color: #1e1e1e;
    }
`

export const ERC1155Button = styled.button`
    font-weight: 550;
    background-color: #1e1e1e;
    color: #6673ff;
    border: 2px solid #6673ff;
    border-radius: 4px;
    box-shadow: 0 6px 20px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    padding: 5px 10px;
    margin-left: 10px;

    &:hover{
        background-color: #6673ff;
        color: #1e1e1e;
    }
`