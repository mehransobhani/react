import React from 'react';
import WarningRedImage from '../../assets/images/warning_red.png';
const ErrorAlert = (props) => {
    return(
        <div className={['d-flex', 'rounded', 'shdow', 'align-items-center', 'p-1'].join(' ')} style={{direction: 'rtl', backgroundColor: '#fccfcf'}}>
            <img src={WarningRedImage} style={{width: '24px'}} />
            <p className={['m-0','mr-2'].join(' ')}>{props.text}</p>
        </div>
    );
}

export default ErrorAlert;