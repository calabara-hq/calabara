import { useHistory, useParams } from "react-router-dom";
import React, { useState, useEffect, Suspense } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setContestHash } from "./contest-interface-reducer";
import { Placeholder } from "../../common/common_components";
import { socket } from "../../service/socket";
import { selectContestState } from "./contest-interface-reducer";
import fetchContest from "./interface-data-fetch";
import ContestInterface from './interface'
import styled from 'styled-components'


const FallbackInterface = styled.div`
    width: 70vw;
    height: 80vh;
`



export default function ContestInterfaceController() {
    const { ens, contest_hash } = useParams();
    let fetch_data = fetchContest(ens, contest_hash);



    useEffect(() => {
        console.log('trying to connect to socket')

        socket.emit('subscribe', contest_hash, error => {
            if (error) {
                console.log(error)
            }
        })


        /*

        /*
        socket.on('connect', () => {
            socket.join(contest_hash)
        })

        socket.on('disconnect', () => {
            socket.leave(contest_hash)

        })
        */

        return () => {
            socket.off('connect')
            socket.off('disconnect')
        }
    }, [])



    return (
        <Suspense fallback={<FallbackInterface />}>
            <RenderInterface fetch_data={fetch_data} />
        </Suspense>
    )
}

function RenderInterface({ fetch_data }) {
    let contest_data = fetch_data.read();

    return (
        <ContestInterface contest_settings={contest_data.settings} prompt_data={contest_data.prompt_data} />
    )
}