import React from 'react'
import DateTimeSelector from "./datepicker"
import '../../../../css/datepicker.css'

export default function ContestDateTimeBlock(props) {
    return (
        <div className="start-end-time-container">
            <DateTimeSelector id = {0} label={'start date'} date = {props.date_0} setDate = {props.setDate_0} />
            <DateTimeSelector id = {2} label={'submission period end / voting period begin'} date = {props.date_2} setDate = {props.setDate_2} minDate = {props.date_1} />
            <DateTimeSelector id = {3} label={'end date'} date = {props.date_3} setDate = {props.setDate_3} minDate = {props.date_2} />

        </div>
    )
}