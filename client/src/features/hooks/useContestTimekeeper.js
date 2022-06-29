import React, { useReducer, useState, useRef, useCallback, useEffect } from 'react';
import moment from 'moment';
import { indexOf } from '@metamask/jazzicon/colors';

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

export default function useContestTimekeeper(setBarProgress, time_0, time_1, time_2 ) {
    const [durations, setDurations] = useState(calculateDuration([0, 0, 0]));
    const timerRef = useRef(0);

    const timerCallback = useCallback(() => {
        setDurations(calculateDuration(time_0, time_1, time_2));
        setBarProgress((moment().format('x') - moment(time_0).format('x')) / ((moment(time_2).format('x') - moment(time_0).format('x'))) * 100)

    }, [time_0, time_1, time_2])

    useEffect(() => {
        console.log('here')
        if (moment(time_2) - moment() < 0) {
            setDurations(['complete', 'complete', 'complete'])
            setBarProgress(100)
        }
        else {
            timerRef.current = setInterval(timerCallback, 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [time_0, time_1, time_2]);



    const calculateActive = () => {
        let index = durations.indexOf('active');
        return index > -1 ? index : 2
    }

    return {
        durations,
        calculateActive: () => calculateActive()
    }
}