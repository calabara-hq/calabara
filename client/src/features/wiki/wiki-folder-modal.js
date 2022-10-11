import React, { useState, useEffect, useReducer } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RuleSelect } from '../manage-widgets/gatekeeper-toggle.js';
import '../../css/wiki-modal.css'
import '../../css/settings-buttons.css'
import '../../css/wallet-modal.css'
import Glyphicon from '@strongdm/glyphicon'


import { selectWikiList, renameWikiList, addToWikiList } from './wiki-reducer.js';
import { selectDashboardRules } from '../gatekeeper/gatekeeper-rules-reducer.js';
import useCommon from '../hooks/useCommon.js';
import useWiki from '../hooks/useWiki.js';

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
    maxHeight: '90vh',
    overflowY: 'scroll',
    maxWidth: '1130px',
    minWidth: '350px'
};


function reducer(state, action) {
    switch (action.type) {
        case 'update_single':
            return { ...state, ...action.payload };
        case 'update_all':
            return { ...action.payload }
        default:
            throw new Error();
    }
}


export default function WikiModal({ modalOpen, handleClose, groupID }) {
    const wikiList = useSelector(selectWikiList)
    const [ruleError, setRuleError] = useState(false)
    const [progress, setProgress] = useState(0)
    const [groupingName, setGroupingName] = useState("");
    const [isFolderError, setIsFolderError] = useState(false);
    const availableRules = useSelector(selectDashboardRules);
    const { ens } = useParams();
    const dispatch = useDispatch();
    const [appliedRules, setAppliedRules] = useReducer(reducer, {});
    const { authenticated_post } = useCommon();
    const { renameWikiList } = useWiki();

    useEffect(() => {

        if (groupID != null) {
            setAppliedRules({ type: 'update_all', payload: wikiList[groupID].gk_rules })
            setGroupingName(wikiList[groupID].group_name)
        }
    }, [wikiList])


    const handleSave = async () => {
        // if there are no gatekeeper rules or name applied just close without doing anything    
        if (Object.keys(appliedRules).length == 0 && groupingName == "") {
            handleClose({ type: "standard" });
        }

        else {
            // check if there are any blank gatekeepers
            for (const [key, value] of Object.entries(appliedRules)) {
                if (value == "") {
                    setRuleError({ id: key })
                    return;
                }
            }

            if (groupingName == "") {
                setIsFolderError(true)
                return
            }

            if (groupID == null) {
                // it's a new folder
                let res = await authenticated_post('/wiki/addWikiGrouping', { ens: ens, groupingName: groupingName, gk_rules: appliedRules })
                if (res) {
                    dispatch(addToWikiList({
                        group_id: res.data.group_id,
                        value: {
                            group_name: groupingName,
                            gk_rules: appliedRules,
                            list: []
                        }
                    }))
                    handleClose({ type: "standard" });

                }
            }
            else {
                // it's an update to existing folder
                let res = await authenticated_post('/wiki/updateWikiGrouping', { groupID: groupID, ens: ens, groupingName: groupingName, gk_rules: appliedRules })
                if (res) {
                    renameWikiList({
                        group_id: groupID,
                        value: {
                            group_name: groupingName,
                            gk_rules: appliedRules,
                            list: wikiList[groupID].list
                        }
                    })
                    handleClose({ type: "standard" });

                }
            }
        }
    }




    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={() => { handleClose({ type: 'standard' }) }}
            >
                <Box className="wiki-modal" sx={style}>
                    <div className="wiki-folder-modal-container">
                        <button className="exit-btn" onClick={() => { handleClose({ type: 'standard' }) }}><Glyphicon glyph="remove" /></button>
                        <h2>{groupID ? 'Edit Folder' : 'New Folder'}</h2>

                        <WikiFolderName groupID={groupID} groupingName={groupingName} setGroupingName={setGroupingName} isFolderError={isFolderError} setIsFolderError={setIsFolderError} handleClose={handleClose} />
                        <WikiFolderRules handleSave={handleSave} appliedRules={appliedRules} setAppliedRules={setAppliedRules} />
                    </div>

                </Box>
            </Modal>
        </div>
    );
}



function WikiFolderName({ groupID, groupingName, setGroupingName, isFolderError, setIsFolderError, handleClose }) {
    const dispatch = useDispatch();
    const { ens } = useParams();


    const deleteGrouping = async () => {

        handleClose({ type: 'delete', ens: ens, groupID: groupID });
    }
    return (
        <div className="folder-name-delete-flex">
            <div className="folder-name">
                <p> Folder Name </p>
                <input className={isFolderError ? 'error' : undefined} value={groupingName} onChange={(e) => { setGroupingName(e.target.value); setIsFolderError(false) }}></input>
                {isFolderError &&
                    <div className="tab-message error" style={{ width: "100%" }}>
                        <p>Please give your folder a name</p>
                    </div>
                }
            </div>

            {groupID != null &&
                <div className="dangerzone">
                    <div className="tab-dangerzone-msg">
                        <p>Danger Zone</p>
                    </div>
                    <div className="danger-contents">
                        <div className="danger-description">
                            <p>Delete folder</p>
                            <p>Deleting this folder will permanently delete all child documents</p>
                        </div>
                        <button onClick={deleteGrouping}> delete </button>
                    </div>
                </div>
            }
        </div>
    )
}


function WikiFolderRules({ handleSave, appliedRules, setAppliedRules }) {
    return (
        <ConfigureGatekeeper handleSave={handleSave} appliedRules={appliedRules} setAppliedRules={setAppliedRules} />
    )
}


function ConfigureGatekeeper({ appliedRules, setAppliedRules, handleSave }) {

    const [ruleError, setRuleError] = useState(false);
    const availableRules = useSelector(selectDashboardRules);


    const handleNext = () => {
        // check if selected gatekeepers have a threshold value set
        for (const [key, value] of Object.entries(appliedRules)) {
            if (value == '') {
                setRuleError({ id: key })
                return;
            }
        }

        handleSave();

    }

    return (
        <div className="manage-widgets-configure-gatekeeper-tab">
            {Object.keys(availableRules).length == 0 ?
                <div className="tab-message neutral">
                    <p>Nothing to do. There are no gatekeepers configured for this organization. Gatekeepers can be added in organization settings.</p>
                </div>
                :
                <>
                    <div className="tab-message neutral">
                        <p>Toggle the switches to apply gatekeeper rules to this widget. If multiple rules are applied, the gatekeeper will pass if the connected wallet passes 1 or more rules.</p>
                    </div>
                    <RuleSelect ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={"wiki-rule"} />
                </>
            }

            <div className="manage-widgets-next-previous-ctr">
                <button className={"save-btn"} onClick={handleNext}>save</button>
            </div>

        </div>
    )
}