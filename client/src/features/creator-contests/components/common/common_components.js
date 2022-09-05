import React, { useState, useEffect, useRef, useCallback } from 'react'
import moment from 'moment';

function ToggleButton({ identifier, isToggleOn, handleToggle }) {

    return (
        <div className="gatekeeper-toggle">
            <input checked={isToggleOn} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle-${identifier}`} type="checkbox" />
            <label style={{ background: isToggleOn && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle-${identifier}`}>
                <span className={`react-switch-button`} />
            </label>
        </div>
    )
}



/*
 take 3 contest datetimes and calculate progress
 times will always be either active or complete
 if submit time negative && vote time positive, submit is active
 if submit time negative && vote time negative, submit is closed

 same with vote / end time relationship

 
 */

const calculateDuration = (time_0, time_1, time_2) => {

    let submit_time = moment.duration(moment(time_0).diff(moment()));
    let vote_time = moment.duration(moment(time_1).diff(moment()))
    let end_time = moment.duration(moment(time_2).diff(moment()))

    submit_time = vote_time.milliseconds() > 0 ? 'active' : 'complete';

    vote_time = submit_time === 'complete' ? (end_time.milliseconds() > 0 ? 'active' : 'complete') : `${vote_time.days()}:${vote_time.hours()}:${vote_time.minutes()}:${vote_time.seconds()}`


     end_time = end_time.milliseconds() > 0 ? `${end_time.days()}:${end_time.hours()}:${end_time.minutes()}:${end_time.seconds()}` : 'complete'


    return [
        submit_time,
        vote_time,
        end_time
    ]

}

function Countdown({ setBarProgress, time_0, time_1, time_2, interval }) {
    const [durations, setDurations] = useState(calculateDuration([0, 0, 0]));
    const timerRef = useRef(0);
    const timerCallback = useCallback(() => {
        setDurations(calculateDuration(time_0, time_1, time_2));
        setBarProgress((moment().format('x') - moment(time_0).format('x')) / ((moment(time_2).format('x') - moment(time_0).format('x'))) * 100)

    }, [time_0, time_1, time_2])

    useEffect(() => {
        if (moment(time_2) - moment() < 0) {
            setDurations(['complete', 'complete', 'complete'])
        }
        else {
            timerRef.current = setInterval(timerCallback, interval);
            return () => clearInterval(timerRef.current);
        }
    }, [time_0, time_1, time_2]);



    return (
        <>
            {
                durations.map((duration, index) => {
                    return (
                        <div style={{ fontWeight: 'bold', textAlign: (index < 2 ? (index < 1 ? 'left' : 'center') : 'right') }}>
                            {duration}
                        </div>
                    )
                })
            }
        </>
    )
}

function Placeholder() {
    return (
        <div className="placeholder">
            <div className="spinner">
                <div className="rect1"></div>
                <div className="rect2"></div>
                <div className="rect3"></div>
                <div className="rect4"></div>
                <div className="rect5"></div>
            </div>
        </div>
    );
}

export { ToggleButton, Countdown, Placeholder }