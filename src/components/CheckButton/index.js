import React from 'react';
import CheckTrue from './../../assets/check_true.svg';
import CheckFalse from './../../assets/check_false.svg';

function CheckButton({ value, text, id, func }) {

    return (
        <div className="d-flex align-items-center mb-2" >
            {value ?
                <img src={CheckTrue} alt="check" style={{ width: "8vw" }} onClick={() => { func(id, true) }} /> :
                <img src={CheckFalse} alt="check" style={{ width: "8vw" }} onClick={() => { func(id, true) }} />
            }
            <span className="ml-2 text-white">{text}</span>
        </div>
    )
}

export default CheckButton;