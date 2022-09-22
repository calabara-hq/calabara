import React, { useState, useEffect } from 'react';
import './datepicker.css'
import { DateTimePicker, RainbowThemeContainer } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';


export default function DateTimeSelector(props) {

    const [locale, setLocale] = useState({ name: 'en-US', label: 'English (US)' })


    const theme = {
        rainbow: {
            palette: {
                brand: '#539bf5',
                brand_alt: '#f2f2f2',
                mainBackground: '#303030',
            },
        },
    };



    return (
        <RainbowThemeContainer
            theme={theme}
        >
                <DateTimePicker
                    id={'datepicker'}
                    label={props.label}
                    value={props.date}
                    onChange={value => props.setDate(value)}
                    minDate={props.minDate || new Date()}
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                    error={props.date < props.minDate ? (!props.date ? null : props.errorMsg) : null}
                    locale={locale.name}
                    okLabel='OK'
                    cancelLabel='Cancel'
                    className='date-time-picker'
                    icon={<FontAwesomeIcon icon={faCalendar} />}
                />
        </RainbowThemeContainer>
    );

}