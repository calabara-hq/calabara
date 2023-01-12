import { useState, useRef, useCallback } from 'react'
import TLDR from './TLDR-editor'
import { createReactEditorJS } from 'react-editor-js'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { WarningMessage } from '../../../../common/common_styles'
import { EDITOR_JS_TOOLS } from '../../../../common/editor_tools'
import Placeholder from '../../../../common/spinner'
import { showNotification } from '../../../../../../notifications/notifications'
import { useWalletContext } from '../../../../../../../app/WalletContext'

import {
    CreateSubmissionContainer,
    SavingSubmissionDiv,
    SubmissionActionButtons,
    SubmitButton,
    CancelButton,
    EditorWrap
} from '../submission-builder-styles'

export default function StandardSubmissionBuilder({ handleExitSubmission, handleCloseDrawer }) {
    const [TLDRImage, setTLDRImage] = useState(null)
    const [TLDRText, setTLDRText] = useState('')
    const { ens, contest_hash } = useParams();
    const ReactEditorJS = createReactEditorJS();
    const editorCore = useRef(null);
    const { authenticated_post } = useWalletContext();
    const [isSaving, setIsSaving] = useState(false);
    const errorCheck = async () => {

        if (!TLDRText && !TLDRImage) {
            showNotification('error', 'error', 'Atleast one TLDR field is required')
            return true
        }
        else if ((TLDRImage && (TLDRText.length > 280)) || (!TLDRImage && (TLDRText.length > 480))) {
            showNotification('error', 'error', 'Your TLDR section is too long')
            return true
        }
        else return false;
    }




    const handleClose = () => {
        if ((!isSaving) && (TLDRImage || TLDRText)) {
            if (window.confirm('you\'re changes will be lost. Do you want to proceed?')) {
                handleExitSubmission();
            }
            else return
        }
        else {
            handleExitSubmission();
        }
    }

    const handleSubmit = async () => {
        let isError = await errorCheck();
        if (isError) return;
        setIsSaving(true);
        let editorData = await editorCore.current.save();
        let submission = {
            tldr_text: TLDRText,
            tldr_image: TLDRImage != null ? TLDRImage.url : null,
            submission_body: editorData
        }

        let res = await authenticated_post('/creator_contests/create_submission', { ens: ens, contest_hash: contest_hash, submission: submission });
        setTimeout(() => {
            handleCloseDrawer();
        }, 500)
    }


    return (
        <>
            <CreateSubmissionContainer isSaving={isSaving}>
                {!isSaving &&
                    <>
                        <SubmissionActionButtons>
                            <CancelButton onClick={handleClose}><FontAwesomeIcon icon={faTimes} /></CancelButton>
                            <SubmitButton onClick={handleSubmit}><FontAwesomeIcon icon={faCheck} /></SubmitButton>
                        </SubmissionActionButtons>
                        <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Create Submission</h2>
                        <EditTLDR TLDRimage={TLDRImage} setTLDRImage={setTLDRImage} TLDRText={TLDRText} setTLDRText={setTLDRText} />
                        <EditLongForm  ReactEditorJS={ReactEditorJS} editorCore={editorCore} />
                    </>

                }

            </CreateSubmissionContainer>
            {isSaving &&
                <SavingSubmissionDiv>
                    <Placeholder />
                </SavingSubmissionDiv>
            }
        </>
    )
}

function EditTLDR({ isUserEligible, TLDRimage, setTLDRImage, TLDRText, setTLDRText }) {
    const [showWarning, setShowWarning] = useState(false);
    return (
        <>
            <div style={{ width: '50%' }}>
                <h2 style={{ textAlign: 'left', color: '#d3d3d3' }}>TLDR</h2>
                <p style={{ color: 'grey' }}>This is what visitors will see on the submission section</p>
            </div>
            {showWarning && <WarningMessage style={{ marginBottom: '10px' }}>You may not be eligible to submit</WarningMessage>}
            <TLDR TLDRimage={TLDRimage} setTLDRImage={setTLDRImage} TLDRText={TLDRText} setTLDRText={setTLDRText} />
        </>
    )
}

function EditLongForm({ ReactEditorJS, editorCore }) {

    return (
        <div>
            <div>
                <h2 style={{ textAlign: 'left', color: '#d3d3d3' }}>Submission</h2>
                <p style={{ color: 'grey' }}>What a visitor sees when your content is expanded</p>
            </div>
            <SubmissionEdit ReactEditorJS={ReactEditorJS} editorCore={editorCore} />
        </div>

    )
}



function SubmissionEdit({ ReactEditorJS, editorCore }) {

    const handleInitialize = useCallback(async (instance) => {
        editorCore.current = instance;
    }, [])



    return (
        <EditorWrap>
            <ReactEditorJS defaultValue={null} ref={editorCore} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
        </EditorWrap>
    )
}