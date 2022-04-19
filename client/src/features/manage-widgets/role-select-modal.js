import React, { useState, useEffect, useReducer } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Glyphicon from '@strongdm/glyphicon'
import SelectRoles from '../../features/manage-widgets/dropdown-select';
import '../../css/role-select-modal.css'
import '../../css/settings-buttons.css'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw',
    bgcolor: '#24262e',
    border: '2px solid rgba(29, 29, 29, 0.3)',
    boxShadow: 10,
    p: 4,
    borderRadius: '20px',
    width: 'fit-content',
    minWidth: '30vw',
    padding: '20px'
};


export default function RoleSelectModal({ modalOpen, handleClose, handleAddDiscordRule, existingRoles }) {


    return (
        <div>
            <Modal
                
                open={modalOpen}
                onClose={() => { handleClose({ type: 'standard' }) }}

            >
                <Box className="role-select-modal" sx={style}>
                    <div className='role-select-modal-container'>
                        <button className="exit-btn" onClick={handleClose}><Glyphicon glyph="remove" /></button>
                        <RoleSelect handleClose={handleClose} handleAddDiscordRule={handleAddDiscordRule} existingRoles={existingRoles} />
                    </div>

                </Box>
            </Modal>
        </div>
    );
}



function RoleSelect({ handleAddDiscordRule, handleClose, existingRoles }) {

    const [appliedRoles, setAppliedRoles] = useState('')


    const cleanDataToSave = () => {
        let clean;
        if (appliedRoles.length > 0) {
            clean = appliedRoles.map((el) => {
                return el.id;
            })
        }
        else{
            clean = [];
        }
        console.log(clean)
        handleAddDiscordRule(clean);
        handleClose();
    }

    return (
        <div>
            <span><h1 style={{ color: 'white' }}>Select Roles</h1></span>
            <div className="role-dropdown">
                <SelectRoles appliedRoles={appliedRoles} setAppliedRoles={setAppliedRoles} existingRoles={existingRoles} />
            </div>
            <div className="role-select-save-ctr">
                <button className='save-btn' onClick={cleanDataToSave}>save</button>
            </div>
        </div>
    )
}