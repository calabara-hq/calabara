import React, { useState, useEffect } from 'react';
import '../../../../../css/datepicker.css'
import { DateTimePicker } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';


export default function DateTimeSelector(props) {

    const [locale, setLocale] = useState({ name: 'en-US', label: 'English (US)' })

    const containerStyles = {
        maxWidth: 300,
        width: '5rem'
    };


    return (
        <DateTimePicker
            id={'datepicker' + props.id}
            label={props.label}
            value={props.date}
            onChange={value => props.setDate(value)}
            minDate={props.minDate || new Date()}
            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
            error={props.date < props.minDate ? (!props.date ? null : "date cannot fall before previous a date") : null}
            locale={locale.name}
            okLabel='OK'
            cancelLabel='Cancel'
            className='date-time-picker'
            icon={<FontAwesomeIcon icon={faCalendar} />}
        />

    );

}