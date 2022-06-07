import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { ToggleButton } from '../common/common_components';
import { Contest_h2, Contest_h3, Contest_h4 } from '../common/common_styles';

const Wrap = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 25%);
`


export default function SimpleInputs({}){
    const [areResultsVisible, setAreResultsVisible] = useState(false);
    const [areAnonSubmissions, setAreAnonSubmissions] = useState(false);

    return(
        <Wrap>
            <Contest_h3>Visible Results</Contest_h3>
            <ToggleButton identifier={'visible-results-toggle'} isToggleOn={areResultsVisible} setIsToggleOn={setAreResultsVisible} handleToggle={() =>  {setAreResultsVisible(!areResultsVisible)}}/>
            <Contest_h3>Anonymous Submissions</Contest_h3>
            <ToggleButton identifier={'anon-submissions-toggle'} isToggleOn={areAnonSubmissions} setIsToggleOn={setAreAnonSubmissions} handleToggle={() =>  {setAreAnonSubmissions(!areAnonSubmissions)}}/>
        </Wrap>

    
    )
}
