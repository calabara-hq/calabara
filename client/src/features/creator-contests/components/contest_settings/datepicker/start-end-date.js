import DateTimeSelector from "../../../../date-time-picker/datepicker";
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

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

const SnapshotHelpWrap = styled.div`
    display: flex;
    flex-direction: column;

    > p {
        margin-bottom: 0;
    }
    > div {
        display: flex;
        color: #7f7f7f;
        background-color: #1e1e1e;
        justify-content: center;
        > p {
            margin-bottom: 0;
            font-size: 14px;
        }
    }
`

export default function ContestDateTimeBlock(props) {
    return (
        <TimeBlockWrapper title='Contest Deadlines' ref={props.TimeBlockRef}>
            <DateTimePickers style={{ alignSelf: 'center' }}>
                <DateTimeSelector id="1" label={'voting begin'} date={props.date_1} setDate={props.setDate_1} minDate={props.currentDate} error={props.date_1 < props.currentDate} errorMsg={'date/time cannot fall before current date/time'} />
                <DateTimeSelector id="2" label={'contest end'} date={props.date_2} setDate={props.setDate_2} minDate={props.date_1} error={props.date_2 < props.date_1} errorMsg={'date/time cannot fall before voting date/time'} />
                <DateTimeSelector id="2" label={<SnapshotHelper />} date={props.snapshotDate} setDate={props.setSnapshotDate} maxDate={props.currentDate} error={props.snapshotDate > props.currentDate} errorMsg={'date/time cannot fall after current date/time'} />
            </DateTimePickers>
        </TimeBlockWrapper>
    )
}

function SnapshotHelper({ }) {
    return (
        <SnapshotHelpWrap>
            <p>snapshot block</p>
            <div><p>we'll use the closest block for any token checks</p></div>
        </SnapshotHelpWrap>
    )
}