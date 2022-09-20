import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import styled from 'styled-components'
import './Clock.css'
import './DateTimePicker.css'
import './Calendar.css'



export default function DateTimePickerComponent({value, onChange}) {

    return (
        <DateTimePicker onChange={onChange} value={value} disableClock={true} calendarIcon={null} clearIcon={null}/>
    );
}