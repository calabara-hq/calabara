import React, { useState, useEffect, useRef, useReducer } from 'react'
import { motion } from "framer-motion"
import axios from 'axios'
import Backdrop from './modal-backdrop.js'
import Glyphicon from '@strongdm/glyphicon'
import '../../css/modal.css'
import '../../css/wiki-modal.css'
import '../../css/settings-buttons.css'
import '../../css/status-messages.css'
import SelectRoles from '../../features/manage-widgets/dropdown-select';



import { useSelector, useDispatch } from 'react-redux';

import {
    addToWikiList,
    selectWikiList,
    removeFromWikiList,
    renameWikiList,
} from '../../features/wiki/wiki-reducer';

import {
    selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';
import { useParams } from 'react-router-dom'

const dropIn = {
    hidden: {
        y: "-100vh",
        opacity: 1,
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.1,
            type: "spring",
            damping: 25,
            stiffness: 500,
        },
    },
    exit: {
        y: "100vh",
        opacity: 1,
    },
};



export default function RoleSelectModal({ handleClose, handleAddDiscordRule, existingRoles }) {
    // tab indicates which help tab we want to show
    const [infoTab, setInfoTab] = useState(false)
    const [saveVisible, setSaveVisible] = useState(false)
    const dispatch = useDispatch();

    async function handleSave() {
        
    }

    return (
        <Backdrop>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="modal white-gradient"
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className='role-select-container'>
                    <button className="closeModalButton" onClick={handleClose}><Glyphicon glyph="remove" /></button>
                    <RoleSelect handleClose={handleClose} handleAddDiscordRule={handleAddDiscordRule} existingRoles={existingRoles} />
                </div>
            </motion.div>
        </Backdrop>
    );
}


function RoleSelect({ handleAddDiscordRule, handleClose, existingRoles }) {

    const [appliedRoles, setAppliedRoles] = useState('')


    const cleanDataToSave = () => {
        if (appliedRoles.length > 0) {
            let clean = appliedRoles.map((el) => {
                return el.id;
            })
            handleAddDiscordRule(clean);
        }
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