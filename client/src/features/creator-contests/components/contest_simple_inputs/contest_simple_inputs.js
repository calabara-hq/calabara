import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ToggleButton } from '../common/common_components';
import { Contest_h2, Contest_h3, Contest_h4 } from '../common/common_styles';

const AdditionalParamsWrap = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #22272e;
    border: 2px solid #444c56;
    border-radius: 4px;
    padding: 10px;
    width: 70%;
    margin: 0 auto;

    > * {
        margin-bottom: 30px;
    }
`

const AdditionalParamsMainHeading = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 33%);
    grid-template-areas: "additional_params . .";
`

const ParamsWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 0 auto;
    grid-gap: 20px;
`

const Parameter = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
`


export default function SimpleInputs({ }) {
    const [areResultsVisible, setAreResultsVisible] = useState(false);
    const [areAnonSubmissions, setAreAnonSubmissions] = useState(false);

    return (
        <AdditionalParamsWrap>
            <AdditionalParamsMainHeading>
                <Contest_h2 grid_area={"additional_params"}>Additional Parameters</Contest_h2>
            </AdditionalParamsMainHeading>
            <ParamsWrap>
                <Parameter>
                    <Contest_h3 >Visible Results</Contest_h3>
                    <ToggleButton identifier={'visible-results-toggle'} isToggleOn={areResultsVisible} setIsToggleOn={setAreResultsVisible} handleToggle={() => { setAreResultsVisible(!areResultsVisible) }} />
                    <p style={{color: '#a3a3a3'}}>Should contest results be visible during voting?</p>
                    <b></b>
                </Parameter>
                <Parameter>
                    <Contest_h3>Anonymous Submissions</Contest_h3>
                    <ToggleButton identifier={'anon-submissions-toggle'} isToggleOn={areAnonSubmissions} setIsToggleOn={setAreAnonSubmissions} handleToggle={() => { setAreAnonSubmissions(!areAnonSubmissions) }} />
                    <p style={{color: '#a3a3a3'}}>Should submitters be anonymous during voting?</p>
                    <b></b>
                </Parameter>
            </ParamsWrap>
        </AdditionalParamsWrap>


    )
}
