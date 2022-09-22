import Drawer from 'react-modern-drawer';
import './drawer.css'
import styled from 'styled-components'
import { fade_in } from '../creator-contests/components/common/common_styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const DrawerContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    //width: 92%;
    margin: 0 auto;
    margin-left: 20px;
    margin-top: 20px;
    height: 100%;
    color: #d3d3d3;
    animation: ${fade_in} 0.5s ease-in-out;

    > * {
        margin-bottom: 30px;
    }
`
const ExitButton = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3em;
    right: 10px;
    top: 20px;
    border: 2px solid #4d4d4d;
    color: grey;
    border-radius: 100%;
    padding: 10px;
    background-color: transparent;
    font-weight: bold;
    cursor: pointer;
    &:hover{
        color: #d3d3d3;
        background-color: rgba(34, 34, 46, 0.8);
        border: 2px solid #d3d3d3;
    }
`

export default function DrawerComponent({ drawerOpen, handleClose, showExit, children }) {


    return (
        <Drawer
            open={drawerOpen}
            onClose={handleClose}
            direction='right'
            style={null}
        >
            {drawerOpen &&
                <DrawerContentWrapper>
                    {showExit && <ExitButton onClick={handleClose}>X</ExitButton>}
                    {children}
                </DrawerContentWrapper>
            }
        </Drawer>
    )
}