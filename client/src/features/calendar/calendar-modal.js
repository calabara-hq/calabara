import React, { useState, useEffect, useReducer } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import DOMPurify from 'dompurify'
import '../../css/calendar-modal.css'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw',
    bgcolor: '#1d1d1d',
    border: '2px solid rgba(29, 29, 29, 0.3)',
    boxShadow: 20,
    p: 4,
    borderRadius: '20px',
    maxWidth: '500px',
    minWidth: '340px',
    padding: '30px'
};


export default function CalendarModal({ modalOpen, handleClose, eventData }) {
    const [dateString, setDateString] = useState('');
    const [description, setDescription] = useState(eventData.description)
    
    function urlify(text) {
      var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      return text.replace(urlRegex, function(url) {
          return '<a target=_blank href="' + url + '">' + url + '</a>';
      });
  
    }
  
    useEffect(() => {
      var d = new Date(eventData.start)
      setDateString(d.toLocaleString())
    }, [])
  
    useEffect(()=>{
      if(eventData.description){
        setDescription(urlify(DOMPurify.sanitize(description)))
      }
    },[eventData.description])




    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={handleClose}

            >
                <Box className="calendar-modal" sx={style}>
                <h1>{eventData.title}</h1>
                    <div className="calendar-modal-container">
                        <div>
                            <span><p>{dateString}</p></span>
                            {description && <span><p><b>description</b></p><p dangerouslySetInnerHTML={{ __html: description }} /></span>}
                            <div className="add-to-gcal">
                                <button onClick={() => { window.open(eventData.htmlLink) }}>add to google cal</button>
                            </div>
                        </div>
                    </div>

                </Box>
            </Modal>
        </div>
    );
}
