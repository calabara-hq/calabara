import React, {useState, useEffect} from 'react'

function ToggleButton({ identifier, isToggleOn, setIsToggleOn, handleToggle }) {

    return (
        <div className="gatekeeper-toggle">
            <input checked={isToggleOn} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle-${identifier}`} type="checkbox" />
            <label style={{ background: isToggleOn && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle-${identifier}`}>
                <span className={`react-switch-button`} />
            </label>
        </div>
    )
}

export {ToggleButton}