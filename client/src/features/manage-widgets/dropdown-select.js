import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import {
  selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';


const animatedComponents = makeAnimated();


const calculateBackgroundColor = (decimal) => {
  if (decimal == 0) {
    return 'rgba(18, 52, 86, 0.3)'
  }
  return 'rgba(' + ((decimal >> 16) & 0xff) + ',' + ((decimal >> 8) & 0xff) + ',' + (decimal & 0xff) + ',0.3)'
}

const calculateTextColor = (decimal) => {
  if (decimal == 0) {
    return 'rgba(211, 211, 211, 1)'
  }
  return 'rgb(' + ((decimal >> 16) & 0xff) + ',' + ((decimal >> 8) & 0xff) + ',' + (decimal & 0xff) + ')'
}

const customStyles = {
  multiValue: (provided, state) => {
    const backgroundColor = calculateBackgroundColor(state.data.color);
    const borderRadius = '8px';
    return { ...provided, backgroundColor, borderRadius }
  },
  multiValueLabel: (provided, state) => {
    const color = calculateTextColor(state.data.color);
    return { ...provided, color }
  },

  control: (provided) => {
    const backgroundColor = '#24262e';
    const border = '1px solid #d2d2d2';
    const cursor = 'pointer';
    return {...provided, border, backgroundColor, cursor}
  },

  option: (provided, state) => {
    const color = calculateTextColor(state.data.color);
    const cursor = 'pointer';
    return { ...provided, color, cursor }
  },

  menuList: (provided) => {
    const backgroundColor = '#1d1d1d';
    const boxShadow =  "0 10px 30px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);"

    return {...provided, backgroundColor, boxShadow}
  },


}


export default function SelectRoles({ existingRoles, setAppliedRoles }) {

  const [availableRoles, setAvailableRoles] = useState('');
  const [parsedDefaultValues, setParsedDefaultValues] = useState('')
  const dashboardRules = useSelector(selectDashboardRules);
  const [isDataReady, setIsDataReady] = useState(false)

  const parseRoles = () => {
    Object.entries(dashboardRules).map(([key, val]) => {
      if (val.type === 'discord') {
        
        const formattedRoles = val.available_roles.map((available) => {
          return { 'value': available.role_name, 'label': available.role_name, 'color': available.role_color, 'id': available.role_id }
        })
        setAvailableRoles(formattedRoles)

        // take in an array of role_id's and format them properly for default values of dropdown

        let formattedDefaultValues = formattedRoles.filter(({ id: x }) => existingRoles.some((el) => el === x))
        setParsedDefaultValues(formattedDefaultValues)
      }
    })
  }



  useEffect(() => {
    parseRoles();
  }, [])

  useEffect(() => {
    if (parsedDefaultValues != null && availableRoles != null) {
      setIsDataReady(true)
    }
  }, [availableRoles, parsedDefaultValues])

  const updateRules = (arr) => {
    setAppliedRoles(arr)
  }




  return (
    <>
      {isDataReady &&
        <Select
          onChange={(e) => { updateRules(e) }}
          closeMenuOnSelect={false}
          isMulti
          options={availableRoles}
          styles={customStyles}
          values={parsedDefaultValues}
          defaultValue={parsedDefaultValues}
        />
      }
    </>
  )


}



