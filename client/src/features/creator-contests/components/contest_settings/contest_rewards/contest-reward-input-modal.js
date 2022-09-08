import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../../../../../css/status-messages.css';
import styled from 'styled-components'
import AddNewToken from '../../common/add_token';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    bgcolor: '#1d1d1d',
    border: '2px solid rgba(29, 29, 29, 0.3)',
    boxShadow: 20,
    p: 4,
    borderRadius: '20px',
    height: 'auto',
    minHeight: '40vh',
    width: '50vw',
    minWidth: '350px'
};

const ModalWrapper = styled.div`
    color: #d3d3d3;
    display: flex;
    flex-direction: column;
`

const ModalHeading = styled.p`
    font-size: 26px;
    width: 'fit-content';
`

// edit type is either new or existing
// tokenType is either erc20 or erc721


export default function EditRewardsModal({ modalOpen, handleClose, existingRewardData, tokenType }) {
    
    const handleSave = (data) => {
        handleClose(data)
    }
    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={() => { handleClose({ type: 'standard' }) }}
            >
                <Box sx={style}>
                    <ModalWrapper>
                        <div>
                            <ModalHeading>Create Reward Option</ModalHeading>
                        </div>
                        <AddNewToken existingRewardData={existingRewardData} type={tokenType} showBackButton={false} handleNextButton={handleSave} />
                    </ModalWrapper>

                </Box>
            </Modal>
        </div>
    );
}

