import React, { useState, useEffect } from 'react';
import '../../../../../css/datepicker.css'
import { DateTimePicker, RainbowThemeContainer } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

export default function DateTimeSelector(props) {

    const [locale, setLocale] = useState({ name: 'en-US', label: 'English (US)' })

    const containerStyles = {
        maxWidth: 600,
        width: '100rem'
    };

    const theme = {
        rainbow: {
            palette: {
                brand: '#539bf5',
                brand_alt: '#f2f2f2',
                mainBackground: '#303030',
                fontSize: '20px',
                rewards_text: [
                    '#80deea',
                    'rgb(173, 156, 220)',
                    'rgb(26, 188, 156)',
                    'rgb(155, 89, 182)',
                ],
                rewards_background: [
                    'rgba(128, 222, 234, 0.3)',
                    'rgba(173, 156, 220, 0.3)',
                    'rgba(26, 188, 156, 0.3)',
                    'rgba(155, 89, 182, 0.3)',
                ],
                rewards_text_alt: [
                    '#d95169',
                    '#3c3c3d',
                    '#03b09f',
                    '#ab6afb',
                ],

            },
        },
    };



    return (
        <RainbowThemeContainer
            className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_large rainbow-m_auto"
            style={containerStyles}
            theme={theme}

        >
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
        </RainbowThemeContainer>
    );

}