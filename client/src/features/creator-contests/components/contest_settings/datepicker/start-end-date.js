import DateTimeSelector from "./datepicker";
import DateTimePickerComponent from "../../../../date-time-picker/date-time-picker";
import '../../../../../css/datepicker.css';
import styled from 'styled-components';
import { useEffect, useState } from "react";

const TimeBlockWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    &::before{
        content: '${props => props.title}';
        position: absolute;
        transform: translate(0%, -150%);
        color: #f2f2f2;
        font-size: 30px;
    }


`

const DateTimePickers = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
    > * {
        margin-bottom: 20px;
    }
`

const PickerWrap = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 300px;
    width: 60%;
`

const PickerLabel = styled.p`
    font-size: 16px;
`

const PickerError = styled.div`
    margin: 10px 0;
`


export default function ContestDateTimeBlock(props) {
    const [date0_error, set_date0_error] = useState(null)
    const [date1_error, set_date1_error] = useState(null)
    const [date2_error, set_date2_error] = useState(null)

    useEffect(() => {
        // clear all errors
        set_date0_error(null)
        set_date1_error(null)
        set_date2_error(null)
        let now = new Date().toISOString();

        if(props.date_1.toISOString() < props.date_0.toISOString()){
            set_date1_error('submission end date cannot fall before start date')
        }

        if(props.date_2.toISOString() < props.date_1.toISOString()){
            set_date2_error('end date cannot fall before submission end date')
        }
    },[props.date_0, props.date_1, props.date_2])




    
    return (
        <TimeBlockWrapper title='Contest Deadlines' ref={props.TimeBlockRef}>

            <DateTimePickers style={{ alignSelf: 'center' }}>
                <PickerWrap>
                    <PickerLabel>start date</PickerLabel>
                    <DateTimePickerComponent value={props.date_0} onChange={props.setDate_0} />
                    {date0_error && <PickerError>{date0_error}</PickerError>}
                </PickerWrap>
                <PickerWrap>
                    <PickerLabel>submission period end / voting period begin</PickerLabel>
                    <DateTimePickerComponent value={props.date_1} onChange={props.setDate_1} />
                    {date1_error && <PickerError>{date1_error}</PickerError>}
                </PickerWrap>
                <PickerWrap>
                    <PickerLabel>end date</PickerLabel>
                    <DateTimePickerComponent value={props.date_2} onChange={props.setDate_2} />
                    {date2_error && <PickerError>{date2_error}</PickerError>}

                </PickerWrap>

                {/*<DateTimeSelector id="0" label={'start date'} date={props.date_0} setDate={props.setDate_0} />
                <DateTimeSelector id="1" label={'submission period end / voting period begin'} date={props.date_1} setDate={props.setDate_1} minDate={props.date_1} />
                <DateTimeSelector id="2" label={'end date'} date={props.date_2} setDate={props.setDate_2} minDate={props.date_1} />
                */}
            </DateTimePickers>

        </TimeBlockWrapper>
    )
}