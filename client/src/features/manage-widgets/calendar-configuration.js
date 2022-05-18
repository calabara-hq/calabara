import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button';

import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    updateWidgetMetadata,
} from '../../features/dashboard/dashboard-widgets-reducer';
import { authenticated_post } from '../common/common';
import useWidgets from '../hooks/useWidgets';

export default function CalendarConfiguration({ mode, metadata, setMetadata, setProgress, setSettingsStep, setTabHeader }) {
    const [configProgress, setConfigProgress] = useState(0)
    const [inputError, setInputError] = useState(0);
    const [calendarID, setCalendarID] = useState(metadata.calendarID || "")
    const [copyStatus, setCopyStatus] = useState('copy to clipboard');
    const {updateWidgetMetadata} = useWidgets();
    const { ens } = useParams();
    const dispatch = useDispatch();


    useEffect(() => {
        setTabHeader('calendar metadata')
    }, [])

    const numSteps = 2;


    const updateCalendarID = (e) => {
        if (inputError == 1) {
            setInputError(0)
        }
        setCalendarID(e.target.value)
    }

    async function submitCalendarID() {
        var result = await axios.post('/dashboard/fetchCalendarMetaData', { calendarID: calendarID })
        if (result.data == 'FAIL') {
            return 'fail'
        }
        else {
            return 'success'
        }
    }

    async function testGrantedAccess() {
        var result = await axios.post('/dashboard/fetchCalendarMetaData', { calendarID: calendarID })

        if (result.data == 'FAIL') {
            return 'fail'
        }
        else {
            return 'success'
        }
    }


    function copyToClipboard() {
        navigator.clipboard.writeText('calabara-service-account@calabara-331416.iam.gserviceaccount.com')
        setCopyStatus('copied!')
        setTimeout(() => { setCopyStatus('copy to clipboard') }, 1000)
    }

    async function handleNext() {
        if (configProgress == 0) {
            // check if we got any input from the calendar ID field
            // if there is no input, set an error.
            // else, check the calendar ID.

            const res = await submitCalendarID();
            if (res == 'success') {

                // found the calendar and we can advance out of this inner loop
                setMetadata({ calendarID: calendarID });
                let response = await authenticated_post('/dashboard/updateWidgetMetadata', { ens: ens, metadata: { calendarID: calendarID }, name: 'calendar' }, dispatch);
                if (response) {
                    updateWidgetMetadata('calendar', { calendarID: calendarID });
                    if (mode === 'new') {
                        setProgress(2);
                    }
                    else if (mode === 'update') {
                        setProgress(0);
                    }
                }
            }
            else {
                // the calendar is not public, ask them to set it to public

                setConfigProgress(1);
            }

        }

        else if (configProgress == 1) {

            const res = await testGrantedAccess();
            if (res == 'fail') {
                setConfigProgress(0);
                setInputError(1);
            }
            else if (res == 'success') {
                setMetadata({ calendarID: calendarID });
                let response = await authenticated_post('/dashboard/updateWidgetMetadata', { ens: ens, metadata: { calendarID: calendarID }, name: 'calendar' }, dispatch);
                if (response) {
                    updateWidgetMetadata('calendar', { calendarID: calendarID })
                    if (mode === 'new') {
                        setProgress(2);
                    }
                    else if (mode === 'update') {
                        setProgress(0);
                    }
                }
            }


        }

    }

    function handlePrevious() {
        console.log(configProgress)
        if (configProgress == 1) {
            setConfigProgress(0);
        }
        else {
            setProgress(0)
        }
    }



    return (
        <>

            {configProgress == 0 &&


                <div className="calendar-step1">
                    <div className="tab-message neutral">
                        <p>Locate the calendar ID for your organization. <u onClick={() => { window.open('https://docs.calabara.com/v1/widgets/calendar-description#integrating-google-calendar') }}>Learn more.</u></p>
                    </div>
                    <div className="calendar-step-text">
                        <p> 1. Open google calendar settings and scroll down to the <strong> Integrate calendar </strong> section</p>
                        <p> 2. Copy the Calendar ID for your organization and paste it in the field below.</p>

                    </div>
                    <div className="calendar-step1-input">
                        <h3> calendar id</h3>
                        <input className={"cal-id-input " + (inputError == 1 ? 'calIdError' : '')} placeholder="xxxxyyyyzzzz@group.calendar.google.com" onChange={updateCalendarID} value={calendarID} />
                        {inputError == 1 &&
                            <div className="tab-message error">
                                <p>This doesn't seem like a valid calendar ID.</p>
                            </div>}
                    </div>
                </div>

            }
            {configProgress == 1 &&
                <div className="calendar-step2">
                    <div className="tab-message warning">
                        <p>It seems that your organizations calendar is not public. That's OK. You will just have to give us access.</p>
                    </div>
                    <div className="calendar-step-text">
                        <p> 1. Copy our service account address below</p>
                        <br />
                        <div className="service-flex">
                            <div className="service-address">
                                <p>calabara-service-account@calabara-331416.iam.gserviceaccount.com</p>
                            </div>
                            <Button className="copy-to-clipboard" onClick={copyToClipboard}><i class="far fa-clipboard"></i></Button>
                        </div>

                        <br />
                        <p> 2. Open the calendar settings again, and find the section near the top titled <strong>Share with specific people.</strong></p>
                        <p> 3. Select <strong>Add people</strong> and paste our account address in the field. Please set the permissions to <strong>See all event details.</strong></p>
                        <p> 4. Click next.</p>
                    </div>
                </div>
            }
            <div className="manage-widgets-next-previous-ctr" style={{ width: '100%' }}>
                <button className={"previous-btn"} onClick={handlePrevious}><i class="fas fa-long-arrow-alt-left"></i></button>
                <button className={"next-btn " + (calendarID == '' ? 'disabled' : 'enable')} onClick={handleNext}><i class="fas fa-long-arrow-alt-right"></i></button>
            </div>
        </>
    )
}
