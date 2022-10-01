import { useHistory, useParams } from "react-router-dom";
import React, { useState, useEffect, Suspense, useRef, useCallback } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setContestSettings, setPromptData, stateReset, updateState, selectIsLoading } from "./contest-interface-reducer";
import Placeholder from "../../common/spinner";
import { socket, initializeSocketConnection, disconnectSocket } from "../../service/socket";
import { selectContestState } from "./contest-interface-reducer";
import ContestInterface from './interface'
import styled from 'styled-components'
import moment from 'moment';

const FallbackInterface = styled.div`
    width: 70vw;
    height: 80vh;
`



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

const calculateProgressRatio = (cc_state, t0, t1, t2) => {
    if (cc_state === 0) {

        //return (((moment().format('x') - moment(t0).format('x')) / ((moment(t1).format('x') - moment(t0).format('x'))) / 2) * 100)
        return (((moment().format('x') - moment(t0).format('x')) / (moment(t1).format('x') - moment(t0).format('x'))) / 2 * 100)
    }
    else if (cc_state === 1) {
        //return barProgress + ((moment().format('x') - moment(t1).format('x')) / ((moment(t2).format('x') - moment(t1).format('x')))* 100)
        return (((moment().format('x') - moment(t1).format('x')) / (moment(t2).format('x') - moment(t1).format('x'))) / 2 * 100 + 50)
    }
    else return 100
}




export default function ContestInterfaceController() {
    const { ens, contest_hash } = useParams();
    const [settings, setSettings] = useState(null);
    const dispatch = useDispatch();
    const timerRef = useRef(null);
    const isLoading = useSelector(selectIsLoading);
    const history = useHistory();


    const updateContestState = (t0, t1, t2) => {
        let time_state = calculateDuration(t0, t1, t2);
        let index = time_state.indexOf('active');
        let cc_state = index = index > -1 ? index : 2;
        let progress_ratio = calculateProgressRatio(cc_state, t0, t1, t2)
        dispatch(updateState({
            durations: time_state,
            progress_ratio: progress_ratio,
            contest_state: cc_state
        }))

        if (cc_state === 2) return clearInterval(timerRef.current);
    }


    useEffect(() => {
        initializeSocketConnection();
        fetch(`/creator_contests/fetch_contest?ens=${ens}&contest_hash=${contest_hash}`)
            .then(data => data.text())
            .then(data => (data ? JSON.parse(data) : {}))
            .then(data => {
                console.log(data)
                dispatch(setContestSettings(data.settings))
                dispatch(setPromptData(data.prompt_data))
                let { start_date, voting_begin, end_date } = data.settings.date_times
                //updateContestState(start_date, voting_begin, end_date)

                timerRef.current = setInterval(() => {
                    updateContestState(start_date, voting_begin, end_date)
                }, 1000)
            })
            .catch(err => {
                return history.push(`/${ens}/creator_contests`)
            })


        socket.on('connect', () => {
            console.log('connected to socket')
            socket.emit('subscribe', contest_hash)
        })


        return () => {
            dispatch(stateReset())
            clearInterval(timerRef.current)
            disconnectSocket();
        }
    }, [])


    if (isLoading) {
        return <Placeholder />
    }

    return (
        <ContestInterface />
    )
}

