import React from 'react'
import DateTimeSelector from "./datepicker"
import '../../../../css/datepicker.css'
import { Contest_h2 } from '../common/common_styles'
import styled from 'styled-components'

const TimeBlockWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    background-color: #22272e;
    border: 2px solid #444c56;
    border-radius: 4px;
    padding: 10px;
    width: 70%;
    margin: 0 auto;
`

const DateTimePickers = styled.div`
    display: flex;
    flex-direction: column;
    > * {
        margin-bottom: 20px;
    }
`


export default function ContestDateTimeBlock(props) {
    return (
        <TimeBlockWrapper>
            <Contest_h2 grid_area={'heading'}>Contest Deadlines</Contest_h2>
            <DateTimePickers style={{ alignSelf: 'center' }}>
                <DateTimeSelector id={0} label={'start date'} date={props.date_0} setDate={props.setDate_0} />
                <DateTimeSelector id={1} label={'submission period end / voting period begin'} date={props.date_1} setDate={props.setDate_1} minDate={props.date_1} />
                <DateTimeSelector id={2} label={'end date'} date={props.date_2} setDate={props.setDate_2} minDate={props.date_1} />
            </DateTimePickers>

        </TimeBlockWrapper>
    )
}