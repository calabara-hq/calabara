import React, { useState, useEffect, useReducer } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../../css/delete-gk-rule-modal.css'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw',
    bgcolor: '#1d1d1d',
    border: '2px solid rgba(29, 29, 29, 0.3)',
    boxShadow: 20,
    p: 4,
    borderRadius: '20px',
    width: '30vw',
    padding: '30px'
};


export default function DeleteGkRuleModal({ modalOpen, handleClose, handleDeleteGkRule, idx }) {


    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={handleClose}

            >
                <Box className="delete-gk-rule-modal" sx={style}>
                    <h1>Delete Rule</h1>
                    <div className="delete-gk-rule-modal-container">
                        <div>
                            <p>If this rule is applied to any applications, deleting it may cause undesired consequences. Are you sure you want to delete?</p>
                            <div className="delete-gk-rule-btn-container">
                                <button className="delete-gk-rule-abort" onClick={handleClose}>cancel</button>
                                <button className="delete-gk-rule-proceed" onClick={() => {handleDeleteGkRule(idx); handleClose();}}>delete</button>
                            </div>
                        </div>
                    </div>

                </Box>
            </Modal>
        </div>
    );
}
