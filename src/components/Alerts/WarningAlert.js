import React from 'react';
import WarningYellowImage from '../../assets/images/warning_yellow.png';
const WarningAlert = (props) => {
    return(
        <div className={['d-flex', 'rounded', 'shdow', 'align-items-center', 'p-1', 'pointer'].join(' ')} style={{direction: 'rtl', backgroundColor: '#fffb91'}}>
            <img src={WarningYellowImage} style={{width: '24px'}} />
            <p className={['mb-0','mr-2', 'ml-2'].join(' ')}>{props.text}</p>
        </div>
    );
}

export default WarningAlert;