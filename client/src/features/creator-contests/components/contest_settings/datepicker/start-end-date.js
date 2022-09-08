import DateTimeSelector from "./datepicker";
import '../../../../../css/datepicker.css';
import { Contest_h2_alt } from '../../common/common_styles';
import styled from 'styled-components';

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
    > * {
        margin-bottom: 20px;
    }
`


export default function ContestDateTimeBlock(props) {
    return (
        <TimeBlockWrapper title='Contest Deadlines'>
            <DateTimePickers style={{ alignSelf: 'center' }}>
                <DateTimeSelector id="0" label={'start date'} date={props.date_0} setDate={props.setDate_0} />
                <DateTimeSelector id="1" label={'submission period end / voting period begin'} date={props.date_1} setDate={props.setDate_1} minDate={props.date_1} />
                <DateTimeSelector id="2" label={'end date'} date={props.date_2} setDate={props.setDate_2} minDate={props.date_1} />
            </DateTimePickers>

        </TimeBlockWrapper>
    )
}