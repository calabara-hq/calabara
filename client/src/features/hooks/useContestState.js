import React, { useReducer, useState, useRef, useCallback, useEffect, useContext } from 'react';
import moment from 'moment';
import { selectProgressRatio, setContestState, setDurations, setProgressRatio } from '../creator-contests/components/contest-live-interface/contest-interface-reducer';
import { useDispatch, useSelector } from 'react-redux';


const calculateDuration = (t0, t1, t2) => {
    let submit_time = moment.duration(moment(t0).diff(moment()));
    let vote_time = moment.duration(moment(t1).diff(moment()))
    let end_time = moment.duration(moment(t2).diff(moment()))
    submit_time = vote_time.milliseconds() > 0 ? 'active' : 'complete';
    vote_time = submit_time === 'complete' ? (end_time.milliseconds() > 0 ? 'active' : 'complete') : `${vote_time.days()}:${vote_time.hours()}:${vote_time.minutes()}:${vote_time.seconds()}`
    end_time = end_time.milliseconds() > 0 ? `${end_time.days()}:${end_time.hours()}:${end_time.minutes()}:${end_time.seconds()}` : 'complete'

    return [
        submit_time,
        vote_time,
        end_time
    ]
}

const calculateProgressRatio = (cc_state, t0, t1, t2, barProgress) => {
    if (cc_state === 0) {

        //return (((moment().format('x') - moment(t0).format('x')) / ((moment(t1).format('x') - moment(t0).format('x'))) / 2) * 100)
        return (((moment().format('x')- moment(t0).format('x')) / (moment(t1).format('x') - moment(t0).format('x'))) / 2 * 100)
    }
    else if (cc_state === 1) {
        //return barProgress + ((moment().format('x') - moment(t1).format('x')) / ((moment(t2).format('x') - moment(t1).format('x')))* 100)
        return (((moment().format('x')- moment(t0).format('x')) / (moment(t2).format('x') - moment(t0).format('x'))) * 100)

    }
    else return 100
}


export default function useContestState(t0, t1, t2) {
    const dispatch = useDispatch();
    const timerRef = useRef(0);
    const barProgress = useSelector(selectProgressRatio)


    const update_contest_state = (t0, t1, t2) => {
        let time_state = calculateDuration(t0, t1, t2);
        dispatch(setDurations(time_state));
        let index = time_state.indexOf('active');
        let cc_state = index = index > -1 ? index : 2;
        dispatch(setProgressRatio(calculateProgressRatio(cc_state, t0, t1, t2)))
        dispatch(setContestState(cc_state))
        if (cc_state === 2) return clearInterval(timerRef.current);
    }

    useEffect(() => {
        let beg = (moment(t0).format('x'))
        let mid = (moment(t1).format('x'))
        let end = (moment(t2).format('x'))


        if (t0) {
            // once we have timestamps, initiate the interval
            timerRef.current = setInterval(() => {
                update_contest_state(t0, t1, t2)
            }, 1000)
            return () => clearInterval(timerRef.current)

        }
    }, [])
}