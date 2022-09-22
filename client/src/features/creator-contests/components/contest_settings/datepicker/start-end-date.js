import DateTimeSelector from "../../../../date-time-picker/datepicker";
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
const PickerError = styled.div`
    margin: 10px 0;
`


export default function ContestDateTimeBlock(props) {
    const [date0_error, set_date0_error] = useState(null)
    const [date1_error, set_date1_error] = useState(null)
    const [date2_error, set_date2_error] = useState(null)

    console.log('re rendering')


    return (
        <TimeBlockWrapper title='Contest Deadlines' ref={props.TimeBlockRef}>
            <DateTimePickers style={{ alignSelf: 'center' }}>
                <DateTimeSelector id="1" label={'voting begin'} date={props.date_1} setDate={props.setDate_1} minDate={props.currentDate} errorMsg={'date/time cannot fall before current date/time'} />
                <DateTimeSelector id="2" label={'contest end'} date={props.date_2} setDate={props.setDate_2} minDate={props.date_1} errorMsg={'date/time cannot fall before voting date/time'} />
            </DateTimePickers>
        </TimeBlockWrapper>
    )
}